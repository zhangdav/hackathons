// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title deployed on the destination chain to provide users with a liquidity pool
 * @author David Zhang
 * @notice Implement the function of cross-chain tokens on the destination chain
 * @dev The withdrawToken function is called by DestChainReceiver to transfer ERC20 to the cross-chain applicant
 */
contract LiquidityPool is ReentrancyGuard, Ownable {
    ////////////
    // Errors //
    ////////////

    error LiquidityPool__TransferFailed();
    error LiquidityPool__NeedSendMore();
    error LiquidityPool__InsufficientBalance();

    /////////////////////
    // State Variables //
    /////////////////////

    IERC20 private immutable i_token;

    mapping(address => uint256) private balances;

    ////////////
    // Events //
    ////////////

    event LiquidityPool__Deposited(address indexed sender, uint256 indexed amount);
    event LiquidityPool__WithdrawToken(address indexed to, uint256 indexed amount);

    ///////////////
    // Modifiers //
    ///////////////

    modifier moreThanZero(uint256 amount) {
        if (amount == 0) {
            revert LiquidityPool__NeedSendMore();
        }
        _;
    }
    ///////////////
    // Functions //
    ///////////////

    constructor(address tokenAddress) Ownable(msg.sender) {
        i_token = IERC20(tokenAddress);
    }

    /////////////////////////////////
    // External / Public Functions //
    /////////////////////////////////

    /**
     * @dev This function is used to deposit ERC20 tokens into the project direction liquidity pool for cross-chain users to withdraw.
     * The project party deposits various ERC20 tokens for the contract, such as: USDT, USDC, DAI, LINK, WETH, WBTC.
     */
    function depositToken(uint256 amount) public moreThanZero(amount) {
        // first need Approve in frontend or polygonscan mumbai
        bool success = i_token.transferFrom(msg.sender, address(this), amount);
        if (!success) {
            revert LiquidityPool__TransferFailed();
        }
        balances[msg.sender] += amount;
        emit LiquidityPool__Deposited(msg.sender, amount);
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
        (bool success) = i_token.transfer(to, amount);
        if (!success) {
            revert LiquidityPool__TransferFailed();
        }
        emit LiquidityPool__WithdrawToken(to, amount);
    }

    ////////////////////////////////////////
    // Getter Public / External Functions //
    ////////////////////////////////////////

    function getPoolBalance() external view returns (uint256) {
        return i_token.balanceOf(address(this));
    }

    function getFundersBalance(address funderAddress) external view returns (uint256) {
        return balances[funderAddress];
    }

    function getTokenAddress() public view returns (address) {
        return address(i_token);
    }

    /////////////////////////////////
    // fallback / receive Function //
    /////////////////////////////////

    fallback() external payable {}
    receive() external payable {}
}
