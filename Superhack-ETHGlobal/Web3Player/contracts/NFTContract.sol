// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract NFTContract is ERC721, Ownable {
    
    uint256 public price;

    mapping(uint256 => uint256) public videoPrices;

    uint256 public tokenId;

    constructor( ) ERC721("Web3Vedio", "WV") {
        tokenId = 1;
    }

    function mintNFT(uint256 _price) external onlyOwner {        
        _mint(msg.sender, tokenId);
        videoPrices[tokenId] = _price;
        tokenId = tokenId + 1;
    }

    function getpriceOfFullVideo(uint256 _tokenId) external view returns (uint256) {
        return videoPrices[_tokenId];
    }

    
}
