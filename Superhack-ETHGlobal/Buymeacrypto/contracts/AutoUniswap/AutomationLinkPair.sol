// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

/* This Smart Contract Deploy on Ethereum Goerli Testnet */
/* ⏰ LINK/USDC Pair Monday, Wednesday, Friday at 8:00 and 16:00 by Chainlink Automation ⏰ */

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
} 

contract AutomationLinkPair{


    address public constant routerAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;	

    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

    address public constant LINK = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    address public constant USDC = 0x07865c6E87B9F70255377e024ace6630C1Eaa37F;

    IERC20 public ILINK = IERC20(LINK);

    uint24 public constant poolFee = 3000;

    function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut) {
        ILINK.approve(address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: LINK,
                tokenOut: USDC,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn) {
        ILINK.approve(address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: LINK,
                tokenOut: USDC,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapRouter.exactOutputSingle(params);
        if (amountIn < amountInMaximum) {
            ILINK.approve(address(swapRouter), 0);
            ILINK.transfer(address(this), amountInMaximum - amountIn);
        }
    }
}

