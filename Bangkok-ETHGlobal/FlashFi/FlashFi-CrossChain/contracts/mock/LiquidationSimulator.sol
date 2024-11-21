// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract LiquidationSimulator {
    uint256 public count;

    constructor() {
        count = 0;
    }

    function setCount(uint256 _count) external {
        count = _count;
    }

    function simulateLiquidation(address /*borrowToken*/, address /*profitToken*/, uint256 /*borrowAmount*/) external {
        count = count + 1;
    }
}