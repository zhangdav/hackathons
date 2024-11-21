// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDT is ERC20 {
    constructor() ERC20("USD Token", "USDT") {
        _mint(msg.sender, 1000000000 * 10 ** 18); // 1000 tokens with 6 decimals
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function mint() public {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }

    function getAddress() public view returns (address) {
        return address(this);
    }
}