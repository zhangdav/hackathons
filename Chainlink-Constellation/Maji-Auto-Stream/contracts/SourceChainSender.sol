// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {AutomationCompatible} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {console} from "hardhat/console.sol";

/**
 * @title Users can create a Stream through this contract
 * @author David Zhang
 * @notice The function of the contract is to provide users with Stream creation,
 * automatic execution and initiation of cross-chain transactions.
 * @dev This implements the Chainlink automation and Chainlink CCIP
 */
contract SourceChainSender is OwnerIsCreator, ReentrancyGuard, AutomationCompatible {
    /* Enums */
    enum payFeesIn {
        Native,
        LINK
    }

    /* State variables */

    // Chainlink CCIP Variables
    IRouterClient private immutable i_router;
    LinkTokenInterface private immutable i_linkToken;
    IERC20 private immutable i_crossChainToken;
    mapping(address => uint256) private balances;
    uint64 private destinationChainSelector;
    address private receiver;
    payFeesIn private feeToken;
    address private to;
    uint256 private quantity;

    // Chainlink Automation Variables
    mapping(address => uint256) private userIntervals;
    uint256 private lastTimeStamp;
    bytes private performData;

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
    event IntervalSet(address indexed sender, uint256 interval);
    event CreatedStream(
        uint64 indexed destChainSelector,
        address indexed receiver,
        payFeesIn indexed payFee,
        address to,
        uint256 amount,
        uint256 interval
    );

    /* Errors */
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error SourceChainSender__NeedSendMore();
    error SourceChainSender__TransferFailed();
    error SourceChainSender__NeedFundToken();
    error SourceChainSender__InsufficientBalance();
    error SourceChainSender__Insufficient();
    error SourceChainSender__WithdrawFailed();

    constructor(address _router, address _link, address _crossChainToken) {
        lastTimeStamp = block.timestamp;
        userIntervals[msg.sender] = 99999999999999999999999999999999999999999999999999999999999999999999999999999;
        i_router = IRouterClient(_router);
        i_linkToken = LinkTokenInterface(_link);
        i_crossChainToken = IERC20(_crossChainToken);
    }

    /* External / Public Functions */

    /**
     * @dev Users will apply for open a stream cross-chain ERC20 tokens and amounts,
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
    }

    /**
     * @dev If the user want stop a stream, they can retrieve their ERC20 tokens through this function
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
     * @dev When the user calls the createStream function, a Stream can be created and the transfer cycle, quantity, recipient address, and target chain need to be set.
     * 1. _destinationChainSelector: The code name of the destination chain (by chainlink)
     * 2. _receiver: The contract address deployed on the destination chain for receiving cross-chain data and execution.(DestChainReceiver.address)
     * 3. _feeToken: The handling fee charged by cross-chain chainlink can be paid with LINK tokens or native tokens.
     * 4. _to: User wallet address to receive ERC20 tokens at the destination chain
     * 5. _quantity: The amount of money the user needs to cross-chain
     * 6. _interval: How often to automatically perform cross-chain transfers for the recipient
     * @notice Before execution, the function will first check whether the user has deposited the required cross-chain amount into the contract.
     */

    function createStream(
        uint64 _destinationChainSelector,
        address _receiver,
        payFeesIn _feeToken,
        address _to,
        uint256 _quantity,
        uint256 _interval
    ) public {
        if (balances[msg.sender] < _quantity) {
            revert SourceChainSender__NeedFundToken();
        }
        balances[msg.sender] -= _quantity;

        destinationChainSelector = _destinationChainSelector;
        receiver = _receiver;
        feeToken = _feeToken;
        to = _to;
        quantity = _quantity;
        userIntervals[msg.sender] = _interval;
        performData = abi.encode(destinationChainSelector, receiver, feeToken, to, quantity);
    }

    /**
     * @dev The checkUpkeep function is automatically executed through the contract address deployed
     * by chainlink automation, and checks whether upkeepNeeded has passed the Intervals set by the user,
     *  and then returns a Boo L value
     */
    function checkUpkeep(bytes calldata /* checkData */ )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */ )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > userIntervals[msg.sender];
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    /**
     * @dev The upkeepNeeded function returns true, and the performUpkeep function is automatically executed in chainlink automation deployment.
     * @notice performData is decoded by abi.decode and passed to Chainlink ccip to execute cross-chain transactions.
     */
    function performUpkeep(bytes calldata /* performData */ ) external override {
        if ((block.timestamp - lastTimeStamp) > userIntervals[msg.sender]) {
            lastTimeStamp = block.timestamp;

            (destinationChainSelector, receiver, feeToken, to, quantity) =
                abi.decode(performData, (uint64, address, payFeesIn, address, uint256));

            bytes memory functionCall = abi.encodeWithSignature("withdrawToken(address,uint256)", to, quantity);

            Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
                receiver: abi.encode(receiver),
                data: functionCall,
                tokenAmounts: new Client.EVMTokenAmount[](0),
                extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 200_000, strict: false})),
                feeToken: feeToken == payFeesIn.LINK ? address(i_linkToken) : address(0)
            });

            uint256 fees = i_router.getFee(destinationChainSelector, evm2AnyMessage);

            bytes32 messageId;

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

            emit MessageSent(messageId, destinationChainSelector, receiver, address(i_linkToken), fees, to, quantity);
        }
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

    function getInterval(address user) external view returns (uint256) {
        return userIntervals[user];
    }

    function getLastTimeStamp() public view returns (uint256) {
        return lastTimeStamp;
    }

    /* fallback & receive */
    receive() external payable {}
}
