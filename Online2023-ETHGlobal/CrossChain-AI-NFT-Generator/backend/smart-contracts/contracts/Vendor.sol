pragma solidity ^0.8.19;
// SPDX-License-Identifier: MIT

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./HPToken.sol";

contract Vendor is Ownable, ReentrancyGuard {
    /* Type declarations */
    HPToken public hpToken;
    uint256 public constant tokensPerEth = 2000;

    /* Events */
    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);
    event SellTokens(address seller, uint256 theAmount, uint256 amountOfETH);

    /* Errors */
    error Vendor__InsufficientBalance();

    constructor(address _tokenAddress) Ownable(msg.sender) {
        hpToken = HPToken(_tokenAddress);
    }

    /* External / Public Functions */
    /**
     * @dev create a payable buyTokens() function:
     */
    function buyTokens() public payable {
        uint256 amountOfEth = msg.value;
        uint256 amountOfTokens = tokensPerEth * amountOfEth;
        hpToken.transfer(msg.sender, amountOfTokens);
        emit BuyTokens(msg.sender, amountOfEth, amountOfTokens);
    }

    /**
     * @dev create a onlyOwnerWithdraw() function that lets the owner withdraw ETH
     */
    function onlyOwnerWithdraw() public onlyOwner nonReentrant {
        if (address(this).balance < 0) {
            revert Vendor__InsufficientBalance();
        }
        (bool success,) = owner().call{value: address(this).balance}("");
        require(success, "withdraw failed!");
    }

    /**
     * @dev create a sellTokens(uint256 _amount) function:
     */
    function sellTokens(uint256 _amount) public {
        uint256 theAmount = _amount;
        uint256 amountOfETH = _amount / tokensPerEth;
        hpToken.transferFrom(msg.sender, address(this), theAmount);
        payable(msg.sender).transfer(amountOfETH);
        emit SellTokens(msg.sender, theAmount, amountOfETH);
    }

    /* fallback & receive */
    receive() external payable {
        buyTokens();
    }

    fallback() external payable {
        buyTokens();
    }
}
