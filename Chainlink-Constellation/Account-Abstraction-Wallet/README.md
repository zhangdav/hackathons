# Account Abstraction Wallet - Cross Chain ERC20 
This is a module that requires abstract wallet cross-chain transactions ERC20.
Supports cross-chain tokens of any ERC20 protocol, including USDC, USDT, DAI, LINK, etc.
It can realize cross-chain transactions for a single transaction, and it can also realize "one-click" cross-chain transactions for multiple transactions.

![2](https://github.com/Solidityarchitect/Account-Abstraction-Wallet/assets/125990317/61814f62-f911-4658-bef8-97d21b02f301)

[![David Zhang YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=piSFMil9NEQ&t=276s)

## Chianlink Hackathon Constellation:
<br/>
<p align="center">
<a href="https://devpost.com/software/demand-abstraction-aa-wallet-with-intent-centric-ai-agent?ref_content=user-portfolio&ref_feature=in_progress" target="_blank">
<img src="https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/docs/logo-chainlink-blue.svg" width="225" alt="Chainlink logo">
</a>
</p>
<br/>

![AA wallet cross chain](https://github.com/Solidityarchitect/cross-chain-erc20/assets/125990317/4ea809f6-9be7-429c-a573-de16b84c6c48)


# About

## USDC TOKEN ADDRESS
- Polygon_Mumbai_USDC: 0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97
- Avalanche_Fuji_USDC: 0x5425890298aed601595a70AB815c96711a31Bc65

## Avalanche Fuji -> Polygon Mumbai USDC
- Polygon_Mumbai:  0x1510c7Bd9c9c7D24B0a1c54CdEb062213A5afB79 LiquidityPool.sol
- Polygon_Mumbai: 0x4De984c203109756eb6365a696037E599dCd973C DestChainReceiver.sol
- Avalanche_Fuji: 0x4faE92E949Ed605b9ac9E7ee1cdCA164CF54410E SourceChainSender.sol

## Polygon Mumbai -> Avalanche Fuji USDC
- Avalanche_Fuji: 0xa4064799b1BE7F708f1F75c44D863750f27A0a3E LiquidityPool.sol
- Avalanche_Fuji: 0x4Ad8C9b33a5dDd7A4762948153Ebd43Bcf8E91Ad DestChainReceiver.sol
- Polygon_Mumbai: 0x4eb8c2c39BF1baA0850BAb49eeF5A6D874E68b08 SourceChainSender.sol

# Getting Started

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- hardhat


```
git clone https://github.com/Solidityarchitect/cross-chain-erc20.git
cd cross-chain-erc20
npm install
```


## Settings .env

```
SEPOLIA_RPC_URL=
FUJI_RPC_URL=
MUMBAI_RPC_URL=
PRIVATE_KEY=
SNOWTRACE_API_KEY=
ETHERSCAN_API_KEY=
POLYGONSCAN_API_KEY=
```


## Scripts

For example, Polygon Mumbai -> Avalanche Fuji USDC:

1. Deploy LiquidityPool.sol on Avalanche Fuji

```
npm hardhat run scripts/01-deploy-lp.js --network fuji
```

2. Deploy DestChainReceiver.sol on Avalanche Fuji

```
npm hardhat run scripts/02-deploy-receiver.js --network fuji
```

3. TransferOwnership from LiquidityPool.sol to DestChainReceiver.sol address on Avalanche Fuji.
   In order to ensure the security of the tokens in the LiquidityPool contract, we do not want anyone to be able to take away the tokens

```
npm hardhat run scripts/03-transferowner.js --network fuji  (Pass in the deployed DestChainReceiverAddress and liquidityPoolAddress)
```

4. Deploy SourceChainSender.sol on Polygon Mumbai

```
npm hardhat run scripts/04-deploy-sender.js --network polygonMumbai
```

## Cross-chain 1 USDC
1. Build a liquidity pool contract: The project direction is to charge the target chain lp contract with cross-chain ERC20 tokens, such as 1 USDC

2. Pay the cross-chain fee: The project direction recharges the cross-chain fee to SourceChainSender.sol. Each cross-chain handling fee is approximately 0.3 LINK.

3. Initiate cross-chain: transfer 1 USDC in Avalanche Fuji by calling the fund function in the SourceChainSender.sol contract(approve first).
```
    uint64 destinationChainSelector, // 0x554472a2720e5e7d5d3c817529aba05eed5f82d8
    address receiver, // DestChainReceiver address
    payFeesIn feeToken, // 1
    address to, // user address
    uint256 amount // cross-chain amount
 ```

 4. Chainlink Explorer: Enter [chainlink Explorer](https://ccip.chain.link/) to view the cross-chain status
    Go to the metamask copy ```Transaction ID ```
