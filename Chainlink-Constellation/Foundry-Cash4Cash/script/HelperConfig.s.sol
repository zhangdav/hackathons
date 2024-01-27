// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {MockV3Aggregator} from "../test/mock/MockV3Aggregator.sol";
import {Script} from "forge-std/Script.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/ERC20Mock.sol";

contract HelperConfig is Script {
    NetworkConfig public activeNetworkConfig;

    uint8 public constant DECIMALS = 8;
    int256 public constant INITIAL_PRICE = 1e8;
    uint256 public DEFAULT_ANVIL_PRIVATE_KEY = 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6;

    struct NetworkConfig {
        address usdc;
        address priceFeed;
        uint256 deployerKey;
    }

    event HelperConfig__CreatedMockPriceFeed(address priceFeed);

    constructor() {
        if (block.chainid == 80001) {
            activeNetworkConfig = getMumbaiUsdcConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilUsdcConfig();
        }
    }

    function getMumbaiUsdcConfig() public view returns (NetworkConfig memory mumbaiNetworkConfig) {
        mumbaiNetworkConfig = NetworkConfig({
            usdc: 0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97, // USDC address on polygon Mumbai
            priceFeed: 0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0, // USDC / USD on polygon Mumbai
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getOrCreateAnvilUsdcConfig() public returns (NetworkConfig memory anvilNetworkConfig) {
        if (activeNetworkConfig.priceFeed != address(0)) {
            return activeNetworkConfig;
        }
        vm.startBroadcast();
        MockV3Aggregator mockPriceFeed = new MockV3Aggregator(
            DECIMALS,
            INITIAL_PRICE
        );

        ERC20Mock usdcMock = new ERC20Mock("WETH", "WETH", msg.sender, 1000e8);
        vm.stopBroadcast();

        anvilNetworkConfig = NetworkConfig({
            usdc: address(usdcMock),
            priceFeed: address(mockPriceFeed), // ETH / USD
            deployerKey: DEFAULT_ANVIL_PRIVATE_KEY
        });
    }
}
