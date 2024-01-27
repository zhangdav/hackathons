// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PriceConverter.sol";

contract LendingContract {
    /* State variables */
    // Chainlink Data Feeds Variables
    AggregatorV3Interface private s_priceFeed;

    using PriceConverter for uint256;

    // LendingContract Variables
    mapping(address => LoanRequest) private loanRequests;
    IERC20 private immutable i_token;
    Lenders[] private lenders;
    mapping(address => uint256) private nameToAmount;
    mapping(address => uint256) private balances;
    mapping(uint256 => RemainingLoanTime) private remainingLoanTerms;
    address[] private borrowers;

    /* Events */
    event Loan(address indexed lender, address indexed borrower, uint256 indexed amount);
    event Repay(address indexed borrower, address indexed lender, uint256 indexed amount);
    event RequstLoan(
        address indexed borrower, uint256 indexed id, uint256 indexed amount, uint256 loanTerm, address lender
    );

    /* Errors */
    error LendingContract__TransferFailed();

    /* Struct */
    struct Lenders {
        uint256 amount;
        address lender;
    }

    struct LoanRequest {
        uint256 orderId;
        uint256 amount;
        uint256 loanTerm;
    }

    struct RemainingLoanTime {
        uint256 loanTerm; // in seconds
        uint256 createdAt; // timestamp when the loan request was created
        address borrower;
    }

    constructor(address tokenAddress, address priceFeed) {
        i_token = IERC20(tokenAddress);
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }

    /* External / Public Functions */
    function requestLoan(uint256 orderId, uint256 amount, uint256 loanTerm, address lender) public {
        loanRequests[msg.sender] = LoanRequest(orderId, amount, loanTerm);
        remainingLoanTerms[orderId] = RemainingLoanTime(loanTerm, block.timestamp, msg.sender);
        borrowers.push(msg.sender);
        // addLender
        require(orderId == loanRequests[msg.sender].orderId, "Invalid transaction ID");
        lenders.push(Lenders(amount, lender));
        nameToAmount[lender] = amount;

        emit RequstLoan(msg.sender, orderId, amount, loanTerm, lender);
    }

    function lending(uint256 orderId, uint256 amount, address borrower) public {
        require(orderId == loanRequests[borrower].orderId, "Invalid transaction ID");
        require(amount == nameToAmount[msg.sender], "Insufficient funds provided by lender");
        require(amount <= loanRequests[borrower].amount, "Exceeded the amount required to borrow");
        bool success = i_token.transferFrom(msg.sender, borrower, amount);
        if (!success) {
            revert LendingContract__TransferFailed();
        }
        balances[msg.sender] += amount;
        emit Loan(msg.sender, borrower, amount);
    }

    function repay(uint256 orderId, uint256 amount, address lender) public {
        require(orderId == loanRequests[msg.sender].orderId, "Invalid transaction ID");
        require(amount == nameToAmount[lender], "Insufficient repay provided by borrower");
        require(amount <= loanRequests[msg.sender].amount, "Exceeded the amount required to borrow");
        bool success = i_token.transferFrom(msg.sender, lender, amount);
        if (!success) {
            revert LendingContract__TransferFailed();
        }
        balances[lender] -= amount;
        emit Repay(msg.sender, lender, amount);
    }

    function remainingLoanTerm(uint256 orderId) public view returns (uint256) {
        require(orderId == loanRequests[msg.sender].orderId, "Invalid transaction ID");
        RemainingLoanTime memory request = remainingLoanTerms[orderId];
        uint256 elapsed = block.timestamp - request.createdAt;
        if (elapsed >= request.loanTerm) {
            return 0;
        } else {
            return request.loanTerm - elapsed;
        }
    }

    /* Getter Functions */
    function getLoanRequest(address borrower) public view returns (uint256) {
        return loanRequests[borrower].amount.getConversionRate(s_priceFeed);
    }
    // USDC/USD

    function getRemainingLoanTerms(uint256 orderId) public view returns (RemainingLoanTime memory) {
        return remainingLoanTerms[orderId];
    }

    function getLoanRequests(address borrower) public view returns (LoanRequest memory) {
        return loanRequests[borrower];
    }

    function getNameToAmount(address lender) public view returns (uint256) {
        return nameToAmount[lender].getConversionRate(s_priceFeed);
    }
    // USDC/USD

    function getBorrowers(uint256 index) public view returns (address) {
        return borrowers[index];
    }

    function getLenders(uint256 index) public view returns (Lenders memory) {
        return lenders[index];
    }

    function getLenderBalance(address lender) public view returns (uint256) {
        return balances[lender].getConversionRate(s_priceFeed);
    }
    // USDC/USD

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    /* fallback & receive */
    receive() external payable {}
    fallback() external payable {}
}
