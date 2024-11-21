// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    constructor() ERC20("Token", "TKN"){
        _mint(msg.sender, 1000000000 * 10 ** 18); // 10 million tokens with 18 decimals
    }

    function mint() public {
        _mint(msg.sender, 10000000 * 10 ** 18);
    }

    function getAddress() public view returns (address) {
        return address(this);
    }
}