// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { OApp, Origin, MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract TreasuryOApp is Ownable, OApp {
    string public data;

    uint16 public constant SEND = 1;

    constructor(address _endpoint) OApp(_endpoint, msg.sender) Ownable(msg.sender) {}

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
        bytes32 /*_guid*/,
        bytes calldata payload,
        address, 
        bytes calldata
    ) internal override {
        data = abi.decode(payload, (string));
    }
}
