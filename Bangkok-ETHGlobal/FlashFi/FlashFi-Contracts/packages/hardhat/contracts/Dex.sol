// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract GenericDex {
    address payable public owner;

    struct TokenPair {
        IERC20Metadata tokenA;
        IERC20Metadata tokenB;
        uint256 rateAtoB;
        uint256 rateBtoA;
    }

    mapping(bytes32 => TokenPair) public tokenPairs;
    mapping(address => mapping(address => uint256)) public tokenBalances;

    uint256 private constant RATE_MULTIPLIER = 1e18;

    constructor() {
        owner = payable(msg.sender);
    }

    function addTokenPairWithDeposit(
        address _tokenA,
        address _tokenB,
        uint256 _rateAtoB,
        uint256 _rateBtoA,
        uint256 _amountA,
        uint256 _amountB
    ) external onlyOwner {
        require(_tokenA != _tokenB, "Tokens must be different");
        require(_amountA > 0 && _amountB > 0, "Initial deposits must be greater than 0");

        bytes32 pairId = keccak256(abi.encodePacked(_tokenA, _tokenB));
        bytes32 reversePairId = keccak256(abi.encodePacked(_tokenB, _tokenA));
        require(address(tokenPairs[pairId].tokenA) == address(0), "Token pair already exists");

        // Create the token pair
        tokenPairs[pairId] = TokenPair(
            IERC20Metadata(_tokenA),
            IERC20Metadata(_tokenB),
            _rateAtoB,
            _rateBtoA
        );
        
        tokenPairs[reversePairId] = TokenPair(
            IERC20Metadata(_tokenB),
            IERC20Metadata(_tokenA),
            _rateBtoA,
            _rateAtoB
        );

        // Deposit tokenA
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        tokenBalances[address(this)][_tokenA] = tokenBalances[address(this)][_tokenA] + _amountA;

        // Deposit tokenB
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);
        tokenBalances[address(this)][_tokenB] = tokenBalances[address(this)][_tokenB] + _amountB;
    }

    function deposit(address _token, uint256 _amount) external {
        require(_amount > 0, "Deposit amount must be greater than 0");
        tokenBalances[address(this)][_token] += _amount;
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    }

    function swap(address _fromToken, address _toToken, uint256 _amount) external {
        bytes32 pairId = keccak256(abi.encodePacked(_fromToken, _toToken));
        TokenPair storage pair = tokenPairs[pairId];
        require(address(pair.tokenA) != address(0), "Token pair does not exist");

        uint256 rate = (address(pair.tokenA) == _fromToken) ? pair.rateAtoB : pair.rateBtoA;
        uint256 toAmount = calculateToAmount(_fromToken, _toToken, _amount, rate);

        require(tokenBalances[address(this)][_toToken] >= toAmount, "Insufficient liquidity");

        IERC20(_fromToken).transferFrom(msg.sender, address(this), _amount);
        IERC20(_toToken).transfer(msg.sender, toAmount);

        tokenBalances[address(this)][_fromToken] += _amount;
        tokenBalances[address(this)][_toToken] -= toAmount;
    }

    function previewSwap(address _fromToken, address _toToken, uint256 _amount) external view returns (uint256) {
        bytes32 pairId = keccak256(abi.encodePacked(_fromToken, _toToken));
        TokenPair storage pair = tokenPairs[pairId];
        require(address(pair.tokenA) != address(0), "Token pair does not exist");

        uint256 rate = (address(pair.tokenA) == _fromToken) ? pair.rateAtoB : pair.rateBtoA;
        return calculateToAmount(_fromToken, _toToken, _amount, rate);
    }

    function calculateToAmount(address _fromToken, address _toToken, uint256 _amount, uint256 _rate) internal view returns (uint256) {
        uint8 fromDecimals = IERC20Metadata(_fromToken).decimals();
        uint8 toDecimals = IERC20Metadata(_toToken).decimals();
        
        uint256 adjustedAmount = _amount * RATE_MULTIPLIER / (10**uint256(fromDecimals));
        uint256 rawToAmount = adjustedAmount * _rate / RATE_MULTIPLIER;
        return rawToAmount * (10**uint256(toDecimals)) / RATE_MULTIPLIER;
    }

    function getBalance(address _token) external view returns (uint256) {
        return tokenBalances[address(this)][_token];
    }

    function withdraw(address _token, uint256 _amount) external onlyOwner {
        require(tokenBalances[address(this)][_token] >= _amount, "Insufficient balance");
        tokenBalances[address(this)][_token] = tokenBalances[address(this)][_token] - _amount;
        IERC20(_token).transfer(msg.sender, _amount);
    }

    function getAddress() public view returns (address) {
        return address(this);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    receive() external payable {}
}