// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {DestChainReceiver} from "../src/DestChainReceiver.sol";
import {LiquidityPool} from "../src/LiquidityPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployDestChainReceiver is Script {
    address public constant ROUTER = 0x1035CabC275068e0F4b745A29CEDf38E13aF41b1; // Mumbai
    address public constant LINK = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB; // Mumbai

    function run() external returns (LiquidityPool, DestChainReceiver) {
        vm.startBroadcast();

        LiquidityPool liquidityPool = new LiquidityPool(LINK);
        DestChainReceiver destChainReceiver = new DestChainReceiver(ROUTER, address(liquidityPool));
        liquidityPool.transferOwnership(address(destChainReceiver));
        vm.stopBroadcast();

        return (liquidityPool, destChainReceiver);
    }
}
