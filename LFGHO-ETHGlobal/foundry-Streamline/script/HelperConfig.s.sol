// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {MockV3Aggregator} from "../test/mocks/MockV3Aggregator.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract HelperConfig is Script {
    NetworkConfig public activeNetworkConfig;
    uint8 public constant DECIMALS = 8;
    int256 public constant DAI_USD_PRICE = 1e8;
    int256 public constant GHO_USD_PRICE = 1e8;
    int256 public constant LINK_USD_PRICE = 1e8;

    uint256 public DEFAULT_ANVIL_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    struct NetworkConfig {
        address linkUsdPriceFeed;
        address daiUsdPriceFeed;
        address ghoUsdPriceFeed;
        address link;
        address dai;
        address gho;
        address payFeesInLink;
        uint256 deployerKey;
    }

    constructor() {
        if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaEthConfig();
        } else if (block.chainid == 31337) {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getSepoliaEthConfig() public view returns (NetworkConfig memory sepoliaNetworkConfig) {
        sepoliaNetworkConfig = NetworkConfig({
            linkUsdPriceFeed: 0xc59E3633BAAC79493d908e63626716e204A45EdF,
            daiUsdPriceFeed: 0x14866185B1962B63C3Ea9E03Bc1da838bab34C19,
            ghoUsdPriceFeed: 0x635A86F9fdD16Ff09A0701C305D3a845F1758b8E,
            link: 0xf8Fb3713D459D7C1018BD0A49D19b4C44290EBE5, // decimal is 18
            dai: 0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357, // decimal is 18
            gho: 0xc4bF5CbDaBE595361438F8c6a187bDc330539c60, // decimal is 18
            payFeesInLink: 0x779877A7B0D9E8603169DdbD7836e478b4624789,
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory) {
        if (activeNetworkConfig.linkUsdPriceFeed != address(0)) {
            return activeNetworkConfig;
        }
        vm.startBroadcast();
        MockV3Aggregator linkUsdPriceFeed = new  MockV3Aggregator(DECIMALS, LINK_USD_PRICE);
        ERC20Mock linkMock = new ERC20Mock();

        MockV3Aggregator daiUsdPriceFeed = new  MockV3Aggregator(DECIMALS, DAI_USD_PRICE);
        ERC20Mock daiMock = new ERC20Mock();

        MockV3Aggregator ghoUsdPriceFeed = new  MockV3Aggregator(DECIMALS, GHO_USD_PRICE);
        ERC20Mock ghoMock = new ERC20Mock();
        vm.stopBroadcast();

        return NetworkConfig({
            linkUsdPriceFeed: address(linkUsdPriceFeed),
            daiUsdPriceFeed: address(daiUsdPriceFeed),
            ghoUsdPriceFeed: address(ghoUsdPriceFeed),
            link: address(linkMock),
            dai: address(daiMock),
            gho: address(ghoMock),
            payFeesInLink: address(linkMock),
            deployerKey: DEFAULT_ANVIL_PRIVATE_KEY
        });
    }
}
