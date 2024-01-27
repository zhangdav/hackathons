//SPDX-License-Identifier: MIT;
pragma solidity ^0.7.0;


/* ✅ Sushiswap Smart Contract Should Deploy on Eheterum Mainnet ✅ */
/* ⚠️ notice: Deploy on Ethereum Testnet doesn't work ❌ */
/* WETH / LINK Pair */

interface IUniswapV2Router01 {
function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract Sushiswap {

    address public constant routerAddress = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;	
    IUniswapV2Router01 public immutable sushiswapRouter = IUniswapV2Router01(routerAddress);
    // Sushiswap Router Deploy on Ethereum Mainnet

    address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant LINK = 0x514910771AF9Ca656af840dff83E8264EcF986CA;

    IERC20 public IWETH = IERC20(WETH);


function exactETHForToken(uint amountIn)external returns(uint[] memory amounts){
        address tokenIn = WETH;
        address tokenOut = LINK;
        address[] memory path;
        if (tokenIn == WETH || tokenOut == WETH) {
            path = new address[](2);
            path[0] = WETH;
            path[1] = LINK;
        } 
        uint amountOutMin = 0;
        uint deadline = block.timestamp + 15 minutes;
        IWETH.approve(address(sushiswapRouter), amountIn);
        amounts = sushiswapRouter.swapExactETHForTokens(
            amountOutMin,
            path,
            msg.sender,
            deadline
        );

    }

}