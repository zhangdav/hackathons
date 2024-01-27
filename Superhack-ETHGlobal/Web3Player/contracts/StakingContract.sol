// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7; 

import "hardhat/console.sol";
import "./NFTContract.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract StakingContract is Ownable {

    NFTContract public nftContract;

    mapping(address => uint256) public balances;

    uint256 private priceOfFullVideo;
    
    uint256 public fetchMsgValue;

    address payable public Owner;

    event PlayerToStake(address player, uint256 priceInput);

    constructor (address _nftContractAddress) payable {
        nftContract = NFTContract(_nftContractAddress);
        fetchMsgValue = msg.value;
        Owner = payable(msg.sender);
    }

    function priceOfVideo(uint256 tokenId) public view returns (uint256) {
        return nftContract.getpriceOfFullVideo(tokenId) * 1e15;
    }

    function isMsgValueGreater(uint256 tokenId) public view returns (bool) {
        uint256 price = priceOfVideo(tokenId);
        bool isItGreater = fetchMsgValue == price;
        return isItGreater;
    }

    function msgValue() public view returns (uint256) {
        return fetchMsgValue;
    }

    // Player should staking some eth
    function deposit(uint256 tokenId) external payable {
        priceOfFullVideo = nftContract.getpriceOfFullVideo(tokenId) * 1e15;
        require(msg.value == priceOfFullVideo, "Must send exact amount");
        balances[msg.sender] += priceOfFullVideo;
        emit PlayerToStake(msg.sender, msg.value);
    }

    function withdraw(uint256 priceOfAmountVideoWatched, uint256 tokenId) public payable {
        priceOfFullVideo = nftContract.getpriceOfFullVideo(tokenId);
        uint256 amountOfVideoLeft =  (priceOfFullVideo - priceOfAmountVideoWatched) * 1e15;
        (bool success, ) = Owner.call{value: amountOfVideoLeft}("");
        require(success, "Failed to send Ether");
    }

    function ownerWithdrawAll() public payable onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
}


    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }


}