// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// internal & private view & pure functions
// external & public view & pure functions

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {IERC20} from "aave-v3-core/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StreamVaults
 * @author David Zhang
 * @dev Smart contract for managing token streams and withdrawals, and cross chain to polygon mumbai.
 */
contract StreamVaults is OwnerIsCreator, ReentrancyGuard {
    ////////////
    // Errors //
    ////////////

    error StreamVaults__TransferFailed();
    error StreamVaults__NeedsMoreThanZero();
    error StreamVaults__TransactionFailed();
    error StreamVaults__InsufficientBalance();
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);

    /////////////////////
    // State Variables //
    /////////////////////

    address private immutable i_gho;
    string private streamName;
    IRouterClient private immutable i_router;
    LinkTokenInterface private immutable i_linkToken;

    /* Stream Variables **/
    struct Stream {
        uint256 streamId;
        address receiver;
        address streamVault;
        address asset;
        uint256 amount;
        uint256 totalAmount;
        uint256 interval;
        uint256 endTime;
        uint256 startTime;
    }

    /* Enums */
    enum payFeesIn {
        Native,
        LINK
    }

    /// @dev Mapping from receiver addresses to the details of each stream.
    mapping(address receiver => mapping(uint256 streamId => Stream)) private s_receiverToStreams;
    /// @dev Mapping from receiver addresses to the latest stream ID created.
    mapping(address receiver => uint256 streamId) private s_receiverToStreamId;
    /// @dev Mapping from receiver addresses to the name associated with each stream.
    mapping(address receiver => mapping(uint256 streamId => string name)) private s_receiverToStreamName;
    /// @dev Mapping from receiver addresses to the transaction status for each stream.
    mapping(address receiver => mapping(uint256 streamId => bool txStatus)) private s_receiverTotxStatus;
    /// @dev Mapping from user addresses to the balance in this contract.
    mapping(address user => uint256 balance) private s_balances;
    /// @dev Mapping from vaults addresses to the balance in this contract.
    mapping(address vaults => uint256 balance) private s_vaultsToBalance;

    ////////////
    // Events //
    ////////////

    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        address feeToken,
        uint256 fees,
        address to,
        uint256 amount
    );
    event WithdrawToken(address indexed receiver, uint256 indexed amount);
    event OnlyOwnerWithdraw(address indexed owner, uint256 indexed amount);

    ///////////////
    // Modifiers //
    ///////////////

    modifier moreThanZero(uint256 amount) {
        if (amount == 0) {
            revert StreamVaults__NeedsMoreThanZero();
        }
        _;
    }

    ///////////////
    // Functions //
    ///////////////

    constructor(address gho, address _router, address _link) {
        i_gho = gho; // Received from Stream and Withdraw Token &&  Cross Chain Token and swap to LINK Token on Polygon Mumbai(only)
        i_router = IRouterClient(_router);
        i_linkToken = LinkTokenInterface(_link);
    }

    /////////////////////////////////
    // External / Public Functions //
    /////////////////////////////////

    /**
     * @notice Processes encoded stream data and adds it to the contract state.
     * @param data Encoded stream data.
     */
    function getStreamData(bytes memory data) public {
        (
            uint256 streamId,
            address receiver,
            address streamVault,
            address asset,
            uint256 amount,
            uint256 totalAmount,
            uint256 interval,
            uint256 endTime,
            uint256 startTime
        ) = abi.decode(data, (uint256, address, address, address, uint256, uint256, uint256, uint256, uint256));

        Stream memory streamData = Stream({
            streamId: streamId,
            receiver: receiver,
            streamVault: streamVault,
            asset: asset,
            amount: amount,
            totalAmount: totalAmount,
            interval: interval,
            endTime: endTime,
            startTime: startTime
        });

        s_receiverToStreams[streamData.receiver][streamData.streamId] = streamData;
        s_receiverToStreamId[streamData.receiver] = streamData.streamId;
        s_receiverToStreamName[streamData.receiver][streamData.streamId] = streamName;
        s_balances[streamData.receiver] += streamData.totalAmount;
        s_receiverTotxStatus[streamData.receiver][streamData.streamId] = true;
    }

    /**
     * @notice Withdraws tokens from a specified stream.
     * @param streamId The ID of the stream.
     * @param amount The amount of tokens to withdraw.
     */
    function withdrawToken(uint256 streamId, uint256 amount) public moreThanZero(amount) nonReentrant {
        Stream memory stream = s_receiverToStreams[msg.sender][streamId];
        bool hasSufficientAmount = amount <= stream.totalAmount;
        bool hasSufficientBalance = amount <= s_balances[msg.sender];
        bool hasSufficientTime = block.timestamp < stream.endTime;
        bool isMessageSenderTheReceiver = msg.sender == stream.receiver;
        if (!hasSufficientAmount && !hasSufficientBalance && !hasSufficientTime && !isMessageSenderTheReceiver) {
            revert StreamVaults__TransactionFailed();
        }

        (bool success) = IERC20(i_gho).transfer(msg.sender, amount);
        if (!success) {
            revert StreamVaults__TransferFailed();
        }

        s_balances[msg.sender] -= amount;

        emit WithdrawToken(msg.sender, amount);
    }

    /**
     * @dev The project party can withdraw the tokens deposited by users in the contract
     * and use these tokens to replenish the tokens of the liquidity pool contract.
     * @param amount The amount to withdraw.
     */
    function onlyOwnerWithdraw(uint256 amount) public onlyOwner nonReentrant {
        if (s_vaultsToBalance[address(this)] < amount) {
            revert StreamVaults__InsufficientBalance();
        }
        (bool success) = IERC20(i_gho).transfer(owner(), amount);
        if (!success) {
            revert StreamVaults__TransactionFailed();
        }
        s_vaultsToBalance[address(this)] -= amount;
        emit OnlyOwnerWithdraw(owner(), amount);
    }

    /**
     * @notice Processes encoded stream name data.
     * @param name Encoded stream name data.
     */
    function getStreamNameData(bytes memory name) public {
        string memory nameAsString = abi.decode(name, (string));
        streamName = nameAsString;
    }

    /**
     * @dev Initiates a cross-chain transaction to the destination chain.
     * @param destinationChainSelector Chainlink codename for the destination chain.
     * @param receiver Destination contract address on the target chain.
     * @param feeToken Fee payment token (LINK or ETH).
     * @param to User wallet address to receive tokens on the destination chain.
     * @param amount Amount of tokens to cross-chain.
     * @return messageId Unique identifier for the cross-chain message.
     */
    function sendMessage(
        uint64 destinationChainSelector, // On Polygon Mumbai
        address receiver, // DestChainReceiver Contract Address
        payFeesIn feeToken, // 0 ETH, 1 LINK
        address to,
        uint256 amount
    ) external returns (bytes32 messageId) {
        if (s_balances[msg.sender] < amount) {
            revert StreamVaults__InsufficientBalance();
        }
        s_balances[msg.sender] -= amount;
        s_vaultsToBalance[address(this)] += amount;

        bytes memory functionCall = abi.encodeWithSignature("withdrawToken(address,uint256)", to, amount);

        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: functionCall,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 200_000})),
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

    ////////////////////////////////////////
    // Getter Public / External Functions //
    ////////////////////////////////////////

    /**
     * @notice Retrieves the information of a specific stream created by the user.
     * @param streamId The unique identifier of the stream.
     * @return streamInfo The information of the specified stream.
     */
    function getUserStreamInfo(address receiver, uint256 streamId) external view returns (Stream memory) {
        return s_receiverToStreams[receiver][streamId];
    }

    function getStreamAmount(address receiver, uint256 streamId) external view returns (uint256) {
        return s_receiverToStreams[receiver][streamId].amount;
    }

    function getStreamInterval(address receiver, uint256 streamId) external view returns (uint256) {
        return s_receiverToStreams[receiver][streamId].interval;
    }

    function getStreamEndTime(address receiver, uint256 streamId) external view returns (uint256) {
        return s_receiverToStreams[receiver][streamId].endTime;
    }

    function getStreamAsset(address receiver, uint256 streamId) external view returns (address) {
        return s_receiverToStreams[receiver][streamId].asset;
    }

    function getStreamId(address receiver) external view returns (uint256) {
        return s_receiverToStreamId[receiver];
    }

    function getReceiverCurrentBalance(address receiver) external view returns (uint256) {
        return s_balances[receiver];
    }

    /**
     * @notice Retrieves an array of stream IDs associated with a specific user.
     * @dev This function returns an array containing the unique stream IDs for a given user.
     * @param receiver The address of the user for whom to retrieve stream IDs.
     * @return streamIds An array of stream IDs associated with the specified user.
     * @dev The function queries the internal mapping to determine the number of streams associated with the user,
     * and then populates an array with the corresponding stream IDs. The resulting array is then returned.
     */
    function getReceiverStreamIds(address receiver) external view returns (uint256[] memory) {
        uint256 streamCount = s_receiverToStreamId[receiver];
        uint256 result = streamCount + 1;
        uint256[] memory streamIds = new uint256[](result);

        for (uint256 i = 0; i < result; i++) {
            streamIds[i] = i;
        }

        return streamIds;
    }

    function getStreamName(address receiver, uint256 streamId) external view returns (string memory) {
        return s_receiverToStreamName[receiver][streamId];
    }

    function getStreamReceiverAddress(address receiver, uint256 streamId) external view returns (address) {
        return s_receiverToStreams[receiver][streamId].receiver;
    }

    function getStreamTotalAmount(address receiver, uint256 streamId) external view returns (uint256) {
        return s_receiverToStreams[receiver][streamId].totalAmount;
    }

    function getStreamStartTime(address receiver, uint256 streamId) external view returns (uint256) {
        return s_receiverToStreams[receiver][streamId].startTime;
    }

    function getTransactionStatus(address receiver, uint256 streamId) external view returns (bool) {
        return s_receiverTotxStatus[receiver][streamId];
    }

    /////////////////////////////////
    // fallback / receive Function //
    /////////////////////////////////

    fallback() external payable {}
    receive() external payable {}
}
