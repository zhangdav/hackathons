// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "./LiquidityPool.sol";

/**
 * @title Deployed on the destination chain and used to receive cross-chain data sent from the source chain through CCIP
 * @author David Zhang
 * @dev This implements the Chainlink CCIP
 */
contract DestChainReceiver is CCIPReceiver {
    /* Type declarations */
    LiquidityPool private liquidityPool;

    /* Events */
    event CallData(bytes indexed data);

    /* External / Public Functions */
    constructor(address router, address liquidityPoolAddress) CCIPReceiver(router) {
        liquidityPool = LiquidityPool(payable(liquidityPoolAddress));
    }

    /**
     * @dev Used to receive data from the source chain from CCIP,
     * and then call the withdrawToken function in LiquidityPool.sol through the call function to transfer ERC20 to those who apply for cross-chain
     */
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        (bool success,) = address(liquidityPool).call(any2EvmMessage.data);
        require(success, "Transaction Failed");
    }
}
