// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DaoSig.sol";
import "./Dex.sol";
import "hardhat/console.sol";

/*
    LiquidationSimulator contract
    - Simulates a liquidation
    - Receives flash loan from DaoMultiSig
    - Swaps profit tokens for borrowed tokens
    - Repays flash loan
    - Withdraws any remaining profit
*/

contract LiquidationSimulator is IFlashLoanReceiver {
    DaoMultiSig public flashLender;
    GenericDex public dex;
    address private profitToken; 
    
    event ProfitTaken(address token, uint256 profit);

    constructor(address payable _flashLender, address payable _dex) {
        flashLender = DaoMultiSig(_flashLender);
        dex = GenericDex(_dex);
    }

    /*
        We want to simulate a liquidation
        Contract will be funded with reward tokens
        Must be swapped for borrow token to pay back loan
    */
    function simulateLiquidation(
        address borrowToken,
        address _profitToken,
        uint256 borrowAmount
    ) external {
        // Add balance checks
        console.log("Multisig balance of borrow token:", IERC20(borrowToken).balanceOf(address(flashLender)));
        console.log("Required amount:", borrowAmount);
        
        profitToken = _profitToken; 
        flashLender.flashLoan(borrowToken, borrowAmount);
    }

    function executeOperation(
        address token,
        uint256 amount,
        uint256 fee
    ) external override {
        require(msg.sender == address(flashLender), "Unauthorized");
        require(profitToken != address(0), "Profit token not set");

        uint256 repayAmount = amount + fee;
        
        // Calculate required profit tokens
        uint256 profitBalance = IERC20(profitToken).balanceOf(address(this));
        console.log("Profit balance before swap:", profitBalance);
        
        // Approve DEX to spend profit tokens
        IERC20(profitToken).approve(address(dex), profitBalance);
        
        // Swap for exact output amount
        dex.swap(profitToken, token, profitBalance);
        
        uint256 borrowedBalance = IERC20(token).balanceOf(address(this));
        console.log("Borrowed token balance after swap:", borrowedBalance);
        console.log("Required repayment:", repayAmount);
        
        require(borrowedBalance >= repayAmount, "Insufficient tokens after swap");

        // Repay the flash loan
        require(
            IERC20(token).transfer(address(flashLender), repayAmount),
            "Flash loan repayment failed"
        );

        // Track any remaining profit
        uint256 remainingProfit = IERC20(profitToken).balanceOf(address(this));
        if(remainingProfit > 0) {
            emit ProfitTaken(profitToken, remainingProfit);
        }

        profitToken = address(0);
    }

    function withdrawProfit(address token, address to) external {
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(to, balance);
    }

    function getAddress() public view returns (address) {
        return address(this);
    }
}