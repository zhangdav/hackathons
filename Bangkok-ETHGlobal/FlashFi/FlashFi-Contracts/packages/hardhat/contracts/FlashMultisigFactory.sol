// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DaoSig.sol";

contract FlashMultisigFactory {
    event MultisigDeployed(address indexed multisigAddress, address[] owners, uint256 requiredConfirmations);
    
    function deployNewMultisig(
        address[] memory _owners,
        uint256 _requiredConfirmations
    ) public returns (address) {
        require(_owners.length > 0, "Must provide at least one owner");
        require(_requiredConfirmations > 0 && _requiredConfirmations <= _owners.length, 
            "Invalid number of required confirmations");

        DaoMultiSig newMultisig = new DaoMultiSig(
            _owners,
            _requiredConfirmations
        );
        
        emit MultisigDeployed(address(newMultisig), _owners, _requiredConfirmations);
        return address(newMultisig);
    }

    function getAddress() public view returns (address) {
        return address(this);
    }
}
