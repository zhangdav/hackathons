// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { OApp, Origin, MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract FlashloanOApp is Ownable, OApp {
    string public data;

    uint256 public count;

    address public liquidationSimulator;

    uint16 public constant SEND = 1;

    constructor(address _endpoint, address _liquidationSimulator) OApp(_endpoint, msg.sender) Ownable(msg.sender) {
        liquidationSimulator = _liquidationSimulator;
    }

    function setLiquidationSimulator(address _liquidationSimulator) external onlyOwner {
        liquidationSimulator = _liquidationSimulator;
    }

    function setCount(uint256 _count) external {
        count = _count;
    }

    function send(
        uint32 _dstEid,
        string memory _message,
        bytes calldata _options
    ) external payable {
        bytes memory _payload = abi.encode(_message);
        _lzSend(
            _dstEid,
            _payload,
            _options,
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );
    }

    function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*guid*/,
        bytes calldata payload,
        address,
        bytes calldata 
    ) internal override {
        (
            address borrowToken,
            address profitToken,
            uint256 borrowAmount
        ) = abi.decode(payload, (address, address, uint256)); 

        _callSimulateLiquidation(borrowToken, profitToken, borrowAmount);

        _resetCount();
    }

    function _callSimulateLiquidation(address borrowToken, address profitToken, uint256 borrowAmount) internal {
        (bool success,) = liquidationSimulator.call(
            abi.encodeWithSignature(
                "simulateLiquidation(address,address,uint256)",
                borrowToken,
                profitToken,
                borrowAmount
            )
        );

        require(success, "simulateLiquidation call failed");
    }

    function _resetCount() internal {
        count = 10;
    }
}
