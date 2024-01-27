// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {LendingContract} from "../src/LendingContract.sol";
import {DeployLC} from "../script/DeployLC.s.sol";
import {HelperConfig} from "../script/HelperConfig.s.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/ERC20Mock.sol";

contract LendingContractTest is Test {
    LendingContract public lC;
    DeployLC public deployer;
    HelperConfig public helperConfig;
    address public usdc;
    address public priceFeed;

    address public USER = makeAddr("user");
    address public LENDER = makeAddr("lender");

    uint256 public orderId;

    function setUp() external {
        deployer = new DeployLC();
        (lC, helperConfig) = deployer.run();
        (usdc, priceFeed,) = helperConfig.activeNetworkConfig();
        ERC20Mock(usdc).mint(USER, 1000);
        ERC20Mock(usdc).mint(LENDER, 1000);

        console.log(ERC20Mock(usdc).balanceOf(USER));
        console.log(ERC20Mock(usdc).balanceOf(LENDER));
    }

    // Main Function Test
    function testRequestLoan() external {
        vm.startPrank(USER);
        orderId = 1;
        uint256 amount = 500;
        uint256 loanTerm = 6000;
        lC.requestLoan(orderId, amount, loanTerm, LENDER);

        // Assert
        LendingContract.LoanRequest memory loanRequest = lC.getLoanRequests(USER);
        assertEq(loanRequest.orderId, orderId, "Order ID mismatch");
        assertEq(loanRequest.amount, amount, "Amount mismatch");
        assertEq(loanRequest.loanTerm, loanTerm, "Loan term mismatch");

        vm.stopPrank();
    }

    function testLending() external {
        vm.startPrank(USER);
        orderId = 1;
        uint256 amount = 500;
        uint256 loanTerm = 6000;
        lC.requestLoan(orderId, amount, loanTerm, LENDER);
        vm.stopPrank();

        vm.startPrank(LENDER);
        ERC20Mock(usdc).approve(address(lC), amount);
        lC.lending(orderId, amount, USER);

        // Assert
        uint256 lenderBalance = lC.getLenderBalance(LENDER);
        assertEq(lenderBalance, 500, "Lender balance incorrect after lending");

        vm.stopPrank();
    }

    modifier requestLoanAndLending() {
        vm.startPrank(USER);
        orderId = 1;
        uint256 amount = 500;
        uint256 loanTerm = 6000;
        lC.requestLoan(orderId, amount, loanTerm, LENDER);
        vm.stopPrank();

        vm.startPrank(LENDER);
        ERC20Mock(usdc).approve(address(lC), amount);
        lC.lending(orderId, amount, USER);
        vm.stopPrank();
        _;
    }

    function testRepay() external requestLoanAndLending {
        uint256 preRepayBalance = lC.getLenderBalance(LENDER);

        vm.startPrank(USER);
        uint256 amount = 500;
        orderId = 1;
        ERC20Mock(usdc).approve(address(lC), amount);
        lC.repay(orderId, amount, LENDER);

        // Assert
        uint256 postRepayBalance = lC.getLenderBalance(LENDER);
        assertEq(postRepayBalance, preRepayBalance - 500, "Lender balance incorrect after repayment");
        vm.stopPrank();
    }

    function testRemainingLoanTerm() external requestLoanAndLending {
        vm.startPrank(USER);
        orderId = 1;
        uint256 remainingTerm = lC.remainingLoanTerm(orderId);
        vm.stopPrank();

        // Assert
        assertTrue(remainingTerm <= 6000, "Remaining loan term should be less or equal to the original term");
    }

    // Getter Function Test
    function testGetLoanRequest() external requestLoanAndLending {
        uint256 loanAmountUSD = lC.getLoanRequest(USER);
        console.log("Loan amount in USD:", loanAmountUSD);

        // Assert USDC/USD 1:1
        assertTrue(loanAmountUSD >= 1, "Loan amount in USD should be greater than 0");
    }

    function testGetRemainingLoanTerms() external requestLoanAndLending {
        LendingContract.RemainingLoanTime memory remainingLoanTerm = lC.getRemainingLoanTerms(orderId);
        assertTrue(remainingLoanTerm.loanTerm <= 6000, "Loan term should be less or equal to initial term");
        assertEq(remainingLoanTerm.borrower, USER, "Borrower address mismatch");
    }

    function testGetNameToAmount() external requestLoanAndLending {
        uint256 amountUSD = lC.getNameToAmount(LENDER);
        console.log("Name to amount in USD:", amountUSD);
        assertTrue(amountUSD == 500, "Amount in USD should be greater than 0");
    }

    function testGetBorrowers() external requestLoanAndLending {
        address borrowerAddress = lC.getBorrowers(0);
        assertEq(borrowerAddress, USER, "Borrower address mismatch");
    }

    function testGetLenders() external requestLoanAndLending {
        LendingContract.Lenders memory lender = lC.getLenders(0);
        assertEq(lender.lender, LENDER, "Lender address mismatch");
        assertEq(lender.amount, 500, "Lender amount mismatch");
    }

    function testGetPriceFeed() external {
        address priceFeedAddress = address(lC.getPriceFeed());
        assertEq(priceFeedAddress, priceFeed, "Price feed address mismatch");
    }
}
