// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {console} from "hardhat/console.sol";

/**
 * @title deployed on the destination chain to provide users with a liquidity pool
 * @author David Zhang
 * @notice Implement the function of cross-chain tokens on the destination chain
 * @dev The withdrawToken function is called by DestChainReceiver to transfer ERC20 to the cross-chain applicant
 */
contract LiquidityPool is ReentrancyGuard, Ownable {
    /* Type declarations */
    IERC20 private immutable i_token;

    /* State variables */
    mapping(address => uint256) private balances;

    /* Events */
    event TokenInPut(address indexed sender, uint256 indexed amount);
    event TokenOutPut(address indexed to, uint256 indexed amount);

    /* Errors */
    error LiquidityPool__TransferFailed();
    error LiquidityPool__NeedSendMore();
    error LiquidityPool__InsufficientBalance();

    constructor(address tokenAddress) Ownable(msg.sender) {
        i_token = IERC20(tokenAddress);
    }

    /* External / Public Functions */

    /**
     * @dev This function is used to deposit ERC20 tokens into the project direction liquidity pool for cross-chain users to withdraw.
     * The project party deposits various ERC20 tokens for the contract, such as: USDT, USDC, DAI, LINK, WETH, WBTC.
     */
    function depositToken(uint256 amount) public {
        if (amount == 0) {
            revert LiquidityPool__NeedSendMore();
        }
        bool success = i_token.transferFrom(msg.sender, address(this), amount);
        if (!success) {
            revert LiquidityPool__TransferFailed();
        }
        balances[msg.sender] += amount;
        emit TokenInPut(msg.sender, amount);
    }

    /**
     * @dev This function is to transfer the ERC20 in the contract to the cross-chain applicant.
     * Users can select the ERC20 that needs to be cross-chained on the front end
     * @notice 1. onlyOwner: In order to prevent attackers from arbitrarily withdrawing tokens in the contract through the withdrawToken function,
     * only the owner can call the withdrawToken function.
     * The owner's address is DestChainReceiver.address, because the depositToken function is called between contracts through call(any2EvmMessage.data)
     * 2. nonReentrant: Prevent attackers from launching reentrancy attacks on contracts
     */
    function withdrawToken(address to, uint256 amount) external onlyOwner nonReentrant {
        if (i_token.balanceOf(address(this)) < amount) {
            revert LiquidityPool__InsufficientBalance();
        }
        i_token.transfer(to, amount);
        emit TokenOutPut(to, amount);
    }

    /* Getter Functions */
    function getPoolBalance() external view returns (uint256) {
        return i_token.balanceOf(address(this));
    }

    function getFundersBalance(address funderAddress) external view returns (uint256) {
        return balances[funderAddress];
    }

    function getTokenAddress() public view returns (address) {
        return address(i_token);
    }

    /* fallback & receive */
    receive() external payable {}
    fallback() external payable {}
}
