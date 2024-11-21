// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/*

*/

interface IFlashLoanReceiver {
    function executeOperation(address token, uint256 amount, uint256 fee) external;
}

contract DaoMultiSig is ReentrancyGuard {
    event Deposit(address indexed token, address indexed sender, uint256 amount, uint256 balance);
    event SubmitTransaction(
        address indexed owner, uint256 indexed txIndex, address indexed to, uint256 value, bytes data
    );
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);
    event TokenAdded(address indexed token, uint256 fee);
    event TokenRemoved(address indexed token);
    event FeesCollected(address indexed token, uint256 feeAmount);
    event FeesWithdrawn(address indexed token, address indexed to, uint256 amount);

    // Mapping of supported tokens and their fees
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenFees; // Fee percentage per token (e.g., 0.1% = 1, 1% = 10)
    mapping(address => uint256) public accumulatedFees; // Track fees collected per token
    
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
    }

    // mapping from tx index => owner => bool
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    modifier tokenSupported(address _token) {
        require(supportedTokens[_token], "token not supported");
        _;
    }

    constructor(address[] memory _owners, uint256 _numConfirmationsRequired) {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 && _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    // Add support for a new token
    function addToken(address _token, uint256 _fee) external onlyOwner {
        require(_token != address(0), "invalid token address");
        require(!supportedTokens[_token], "token already supported");
        require(_fee <= 1000, "fee too high"); // Max 10%

        supportedTokens[_token] = true;
        tokenFees[_token] = _fee;

        emit TokenAdded(_token, _fee);
    }

    // Remove support for a token
    function removeToken(address _token) external onlyOwner {
        require(supportedTokens[_token], "token not supported");
        
        supportedTokens[_token] = false;
        delete tokenFees[_token];

        emit TokenRemoved(_token);
    }

    function flashLoan(address _token, uint256 amount) external nonReentrant tokenSupported(_token) {
        uint256 balanceBefore = IERC20(_token).balanceOf(address(this));
        require(balanceBefore >= amount, "Not enough tokens in pool");

        // Calculate fee based on token's decimals
        uint256 feeAmount = (amount * tokenFees[_token]) / 10000;

        // Transfer tokens to borrower
        IERC20(_token).transfer(msg.sender, amount);

        // Call borrower's function
        IFlashLoanReceiver(msg.sender).executeOperation(_token, amount, feeAmount);

        // Check if loan is repaid with fee
        uint256 balanceAfter = IERC20(_token).balanceOf(address(this));
        require(balanceAfter >= balanceBefore + feeAmount, "Flash loan not repaid");

        // Track the collected fee
        accumulatedFees[_token] += feeAmount;
        emit FeesCollected(_token, feeAmount);
    }

    // Withdraw accumulated fees
    function withdrawFees(address _token, address _to, uint256 _amount) 
        external 
        onlyOwner 
        tokenSupported(_token) 
    {
        require(_amount <= accumulatedFees[_token], "Insufficient accumulated fees");
        require(_to != address(0), "Invalid recipient");

        accumulatedFees[_token] -= _amount;
        IERC20(_token).transfer(_to, _amount);

        emit FeesWithdrawn(_token, _to, _amount);
    }

    function submitTransaction(address _to, uint256 _value, bytes memory _data) public onlyOwner {
        uint256 txIndex = transactions.length;

        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            numConfirmations: 0
        }));

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    function confirmTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(uint256 _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(transaction.numConfirmations >= numConfirmationsRequired, "cannot execute tx");

        transaction.executed = true;

        (bool success,) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "tx failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(uint256 _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function getTokenDecimals(address _token) public view returns (uint8) {
        return IERC20Metadata(_token).decimals();
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 _txIndex)
        public
        view
        returns (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations)
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }

    function getAddress() public view returns (address) {
        return address(this);
    }

    receive() external payable {
        emit Deposit(address(0), msg.sender, msg.value, address(this).balance);
    }
}