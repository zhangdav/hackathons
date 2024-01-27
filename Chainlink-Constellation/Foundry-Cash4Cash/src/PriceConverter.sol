// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        (, int256 answer,,,) = priceFeed.latestRoundData();
        // 100007600
        return uint256(answer);
    }

    function getConversionRate(uint256 usdcAmount, AggregatorV3Interface priceFeed) internal view returns (uint256) {
        uint256 usdcPrice = getPrice(priceFeed);
        uint256 usdcAmountInUsd = (usdcPrice * usdcAmount) / 100000000;
        return usdcAmountInUsd;
    }
}
