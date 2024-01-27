// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CrossChainNft is ERC721URIStorage, Ownable {
    /* Type declarations */
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    /* Events */
    event Minted(address indexed minter, string indexed tokenURI);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) Ownable(msg.sender) {}

    /* External / Public Functions */
    function mint(address to, string memory tokenURI) public onlyOwner {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit Minted(to, tokenURI);
    }

    /* Getter Functions */
    function totalSupply() private view returns (uint256) {
        return _tokenIds.current();
    }
}
