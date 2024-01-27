// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Used by users to initiate transactions from the source chain to the target chain
 * @author David Zhang
 * @notice The contract functions as a pledge pool
 * @dev This implements the Chainlink CCIP
 */
contract SourceChainSender is OwnerIsCreator, ReentrancyGuard {
    /* Enums */
    enum payFeesIn {
        Native,
        LINK
    }

    enum costTokensIn {
        Native,
        HP
    }

    /* Type declarations */
    IRouterClient private immutable i_router;
    LinkTokenInterface private immutable i_linkToken;
    IERC20 private hpToken;
    mapping(address => uint256) private ethBalances;
    mapping(address => uint256) private tokenBalances;
    uint256 public costETH;
    uint256 public costToken;

    /* Events */
    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        address feeToken,
        uint256 fees,
        address to
    );
    event EthInPut(address indexed sender, uint256 indexed amount);
    event TokenInPut(address indexed sender, uint256 indexed amount);
    event OwnerWithdrawn(
        address indexed owner, uint256 indexed eth_amount, uint256 indexed token_amount, uint256 pay_fee
    );
    event WithdrawnEth(address indexed minter, uint256 indexed amount);
    event WithdrawnToken(address indexed minter, uint256 indexed amount);

    /* Errors */
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error SourceChainSender__NeedSendMore();
    error SourceChainSender__TransferFailed();
    error SourceChainSender__NeedFundToken();
    error SourceChainSender__InsufficientBalance();
    error SourceChainSender__Insufficient();
    error SourceChainSender__WithdrawFailed();

    constructor(address _router, address _link, address _hpTokenAddress, uint256 _costETH, uint256 _costToken) {
        i_router = IRouterClient(_router);
        i_linkToken = LinkTokenInterface(_link);
        hpToken = IERC20(_hpTokenAddress);
        costETH = _costETH;
        costToken = _costToken;
    }

    /* External / Public Functions */
    function fundETH() public payable {
        if (msg.value < costETH) {
            revert SourceChainSender__NeedSendMore();
        }
        ethBalances[msg.sender] += msg.value;
        emit EthInPut(msg.sender, msg.value);
    }

    function fundToken() public {
        bool success = hpToken.transferFrom(msg.sender, address(this), costToken);
        if (!success) {
            revert SourceChainSender__TransferFailed();
        }
        tokenBalances[msg.sender] += costToken;
        emit TokenInPut(msg.sender, costToken);
    }

    function withdrawETH() public nonReentrant {
        if (ethBalances[msg.sender] < 0) {
            revert SourceChainSender__Insufficient();
        }
        uint256 amount = ethBalances[msg.sender];
        (bool success,) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert SourceChainSender__WithdrawFailed();
        }
        ethBalances[msg.sender] = 0;
        emit WithdrawnEth(msg.sender, amount);
    }

    function withdrawToken() public nonReentrant {
        if (tokenBalances[msg.sender] < 0) {
            revert SourceChainSender__Insufficient();
        }
        uint256 amount = tokenBalances[msg.sender];
        require(hpToken.transfer(msg.sender, amount), "TransactionFailed");
        tokenBalances[msg.sender] = 0;
        emit WithdrawnToken(msg.sender, amount);
    }

    /**
     * @dev The user initiates a cross-chain to the destination chain through this function and passes data to the target chain.
     * 1. destinationChainSelector: The codename of the destination chain (by chainlink)
     * 2. receiver: The contract address deployed on the destination chain for receiving cross-chain data and execution.(DestChainReceiver.address)
     * 3. feeToken: The handling fee charged by cross-chain chainlink can be paid with LINK tokens or native tokens.
     * 4. to: User wallet address to receive ERC20 tokens at the destination chain
     * 5. amount: The amount of money the user needs to cross-chain
     * @notice Before execution, the function will first check whether the user has deposited the required cross-chain amount into the contract.
     */
    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        payFeesIn feeToken,
        costTokensIn _costToken,
        address to,
        string memory tokenURI
    ) external returns (bytes32 messageId) {
        uint256 eth_amount = costETH;
        uint256 token_amount = costToken;
        if (_costToken == costTokensIn.Native) {
            if (ethBalances[msg.sender] < eth_amount) {
                revert SourceChainSender__NeedFundToken();
            }
            ethBalances[msg.sender] -= eth_amount;
        } else if (_costToken == costTokensIn.HP) {
            if (tokenBalances[msg.sender] < token_amount) {
                revert SourceChainSender__NeedFundToken();
            }
            tokenBalances[msg.sender] -= token_amount;
        } else {
            revert SourceChainSender__NeedFundToken();
        }

        bytes memory functionCall = abi.encodeWithSignature("mint(address,string)", to, tokenURI);

        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: functionCall,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 200_000, strict: false})),
            feeToken: feeToken == payFeesIn.LINK ? address(i_linkToken) : address(0)
        });

        uint256 fees = i_router.getFee(destinationChainSelector, evm2AnyMessage);

        if (feeToken == payFeesIn.LINK) {
            if (fees > i_linkToken.balanceOf(address(this))) {
                revert NotEnoughBalance(i_linkToken.balanceOf(address(this)), fees);
            }

            i_linkToken.approve(address(i_router), fees);

            messageId = i_router.ccipSend(destinationChainSelector, evm2AnyMessage);
        } else {
            if (fees > address(this).balance) {
                revert("balance is not enough");
            }

            messageId = i_router.ccipSend{value: fees}(destinationChainSelector, evm2AnyMessage);
        }

        emit MessageSent(messageId, destinationChainSelector, receiver, address(i_linkToken), fees, to);
        return messageId;
    }

    /**
     * @dev The project party can withdraw the tokens deposited by users in the contract and use these tokens to replenish the tokens of the liquidity pool contract.
     */
    function onlyOwnerWithdraw() public onlyOwner nonReentrant {
        // Withdraw ETH
        uint256 eth_amount = address(this).balance;
        if (eth_amount < 0) {
            revert SourceChainSender__Insufficient();
        }
        (bool success,) = payable(owner()).call{value: eth_amount}("");
        if (!success) {
            revert SourceChainSender__WithdrawFailed();
        }

        // Withdraw Token
        uint256 token_amount = hpToken.balanceOf(address(this));
        if (token_amount < 0) {
            revert SourceChainSender__WithdrawFailed();
        }
        hpToken.transfer(owner(), token_amount);

        // Withdraw payFee
        uint256 pay_fee = i_linkToken.balanceOf(address(this));
        if (pay_fee < 0) {
            revert SourceChainSender__WithdrawFailed();
        }
        i_linkToken.transfer(owner(), pay_fee);
        emit OwnerWithdrawn(owner(), eth_amount, token_amount, pay_fee);
    }

    /* Getter Functions */
    function getContractBalance() external view returns (uint256) {
        return hpToken.balanceOf(address(this));
    }

    function getMinterPaidEth(address minter) external view returns (uint256) {
        return ethBalances[minter];
    }

    function getMinterPaidToken(address minter) external view returns (uint256) {
        return tokenBalances[minter];
    }

    function getTokenAddress() public view returns (address) {
        return address(hpToken);
    }

    /* fallback & receive */
    receive() external payable {
        fundETH();
        fundToken();
    }

    fallback() external payable {
        fundETH();
        fundToken();
    }
}
