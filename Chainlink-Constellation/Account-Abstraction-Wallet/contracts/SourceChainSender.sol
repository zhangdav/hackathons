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

    /* Type declarations */
    IRouterClient private immutable i_router;
    LinkTokenInterface private immutable i_linkToken;
    IERC20 private immutable i_crossChainToken;
    mapping(address => uint256) private balances;

    /* Events */
    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        address feeToken,
        uint256 fees,
        address to,
        uint256 amount
    );
    event TokenInPut(address indexed sender, uint256 indexed amount);
    event OwnerWithdrawn(address indexed owner, uint256 indexed amount);
    event Withdrawn(address indexed owner, uint256 indexed amount);

    /* Errors */
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error SourceChainSender__NeedSendMore();
    error SourceChainSender__TransferFailed();
    error SourceChainSender__NeedFundToken();
    error SourceChainSender__InsufficientBalance();
    error SourceChainSender__Insufficient();
    error SourceChainSender__WithdrawFailed();

    constructor(address _router, address _link, address _crossChainToken) {
        i_router = IRouterClient(_router);
        i_linkToken = LinkTokenInterface(_link);
        i_crossChainToken = IERC20(_crossChainToken);
    }

    /* External / Public Functions */

    /**
     * @dev Users will apply for cross-chain ERC20 tokens and amounts,
     * deposit them into this contract, and the contract will lock the tokens.
     */
    function fund(uint256 amount) public {
        if (amount < 0) {
            revert SourceChainSender__NeedSendMore();
        }
        bool success = i_crossChainToken.transferFrom(msg.sender, address(this), amount);
        if (!success) {
            revert SourceChainSender__TransferFailed();
        }
        balances[msg.sender] += amount;
        emit TokenInPut(msg.sender, amount);
    }

    /**
     * @dev If the user does not want to cross-chain,
     * they can retrieve their ERC20 tokens through this function
     */
    function withdraw(uint256 amount) public nonReentrant {
        if (i_crossChainToken.balanceOf(msg.sender) < 0) {
            revert SourceChainSender__Insufficient();
        }
        balances[msg.sender] -= amount;
        bool success = i_crossChainToken.transfer(msg.sender, amount);
        if (!success) {
            revert SourceChainSender__WithdrawFailed();
        }
        emit Withdrawn(msg.sender, amount);
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
        address to,
        uint256 amount
    ) external returns (bytes32 messageId) {
        if (balances[msg.sender] < amount) {
            revert SourceChainSender__NeedFundToken();
        }
        balances[msg.sender] -= amount;

        bytes memory functionCall = abi.encodeWithSignature("withdrawToken(address,uint256)", to, amount);

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

        emit MessageSent(messageId, destinationChainSelector, receiver, address(i_linkToken), fees, to, amount);

        return messageId;
    }

    /**
     * @dev The project party can withdraw the tokens deposited by users in the contract and use these tokens to replenish the tokens of the liquidity pool contract.
     */
    function onlyOwnerWithdraw(uint256 amount) public onlyOwner nonReentrant {
        if (i_crossChainToken.balanceOf(address(this)) < 0) {
            revert SourceChainSender__InsufficientBalance();
        }
        i_crossChainToken.transfer(owner(), amount);
        emit OwnerWithdrawn(owner(), amount);
    }

    /* Getter Functions */
    function getPoolBalance() external view returns (uint256) {
        return i_crossChainToken.balanceOf(address(this));
    }

    function getFunderBalance(address funder) external view returns (uint256) {
        return balances[funder];
    }

    function getTokenAddress() public view returns (address) {
        return address(i_crossChainToken);
    }

    /* fallback & receive */
    receive() external payable {}
}
