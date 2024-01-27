// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    /* Type declarations */
    using Counters for Counters.Counter;

    IERC20 private hpToken;
    Counters.Counter private _tokenIds;
    uint256 private costETH;
    uint256 private costToken;
    mapping(address => uint256) private balances;

    /* Events */
    event EthMint(address indexed minter, uint256 indexed paid);
    event Erc20Mint(address indexed minter, uint256 indexed paid);

    /* Errors */
    error NFT__InsufficientBalance();
    error NFT__NeedSendMore();
    error NFT__TransferFailed();

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _costETH,
        uint256 _costToken,
        address _hpTokenAddress
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        costETH = _costETH;
        costToken = _costToken;
        hpToken = IERC20(_hpTokenAddress);
    }

    /* External / Public Functions */
    function mint(string memory tokenURI) public payable {
        if (msg.value < costETH) {
            revert NFT__NeedSendMore();
        }
        balances[msg.sender] += msg.value;

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit EthMint(msg.sender, msg.value);
    }

    function mintToken(string memory tokenURI) public payable {
        bool success = hpToken.transferFrom(msg.sender, address(this), costToken);
        if (!success) {
            revert NFT__TransferFailed();
        }
        balances[msg.sender] += costToken;

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit Erc20Mint(msg.sender, costToken);
    }

    function onlyOwnerWithdraw() public onlyOwner nonReentrant {
        if (address(this).balance < 0) {
            revert NFT__InsufficientBalance();
        }
        (bool success,) = owner().call{value: address(this).balance}("");
        require(success);
    }

    /* Getter Functions */
    function getMinterPaid(address minter) external view returns (uint256) {
        return balances[minter];
    }

    function getCostETH() external view returns (uint256) {
        return costETH;
    }

    function getCostERC20() external view returns (uint256) {
        return costToken;
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }

    /* fallback & receive */
    receive() external payable {}
    fallback() external payable {}
}
