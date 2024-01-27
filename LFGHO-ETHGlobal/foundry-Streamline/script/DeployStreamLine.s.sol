// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {StreamLine} from "../src/StreamLine.sol";
import {StreamVaults} from "../src/StreamVaults.sol";

contract DeployStreamLine is Script {
    address[] public tokenAddresses;
    address[] public priceFeedAddresses;

    address public aave_Pool = 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951;
    address public router = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
    address public stream_Vaults = 0xf0096580d64a7A3b30fa433731ADc78a8DA9A001;
    address public ghoIRS = 0x521247B4d0a51E71DE580dA2cBF99EB40a44b3Bf; // GHO Borrow Interest Rate Strategy
    address public daiIRS = 0xA813CC4d67821fbAcF24659e414A1Cf6c551373c; // DAI Supply Interest Rate Strategy

    function run() external returns (StreamLine, StreamVaults, HelperConfig) {
        HelperConfig helperConfig = new HelperConfig();

        (
            address linkUsdPriceFeed,
            address daiUsdPriceFeed,
            address ghoUsdPriceFeed,
            address link,
            address dai,
            address gho,
            address payFeesInLink,
            uint256 deployerKey
        ) = helperConfig.activeNetworkConfig();
        tokenAddresses = [link, dai, gho];
        priceFeedAddresses = [linkUsdPriceFeed, daiUsdPriceFeed, ghoUsdPriceFeed];

        vm.startBroadcast(deployerKey);
        StreamVaults streamVaults = new StreamVaults(gho,router,payFeesInLink);
        StreamLine streamLine = new StreamLine(
            aave_Pool,
            gho,
            tokenAddresses,
            priceFeedAddresses,
            address(streamVaults),
            ghoIRS,
            daiIRS
        );
        vm.stopBroadcast();
        return (streamLine, streamVaults, helperConfig);
    }
}
