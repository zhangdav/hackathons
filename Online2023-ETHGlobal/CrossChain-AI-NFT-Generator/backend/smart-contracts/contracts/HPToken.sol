// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HPToken is ERC20 {
    constructor() ERC20("Happy Planet", "HP") {
        _mint(msg.sender, 99999999999999999999999 * 10 ** 18);
    }
}
