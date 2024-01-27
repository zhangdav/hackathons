# MAJI 
[![David Zhang YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=hWrqhRe10s8)

## Chianlink Hackathon Constellation:
<br/>
<p align="center">
<a href="https://devpost.com/software/maji-3j8p1l?ref_content=user-portfolio&ref_feature=in_progress" target="_blank">
<img src="https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/docs/logo-chainlink-blue.svg" width="225" alt="Chainlink logo">
</a>
</p>
<br/>

## MAJI is a Cross-chain real-time Stripe for Web3. 

**Real-time cross-chain subscriptions payments**
A protocol that is a factory for any app to create cross-chain payment streaming and subscriptions. The creators can take funds from any chain - the subscribers can pay from any chain. We abstract all the complexities. 

In particular, we focus on a very specific customer base. Cross-chain money streaming is an excellent use case for Web3 cloud infrastructure payments. Our team combines cross-chain usage-based pricing & real-time streaming to allow Web3 infrastructure providers to charge automatically by the second/hour/minute/month etc...

**1-Access the landing page of the Web3 Dapp**

**2-Access the Subscription checkout builder helping them to Generate subscription revenue in seconds.**

**3-Build your checkout and get paid cross-chain every second.**

**4-Define your payment details and experiment with component styles.**

**5-Export your creation with ease in the most convenient format and seamlessly integrate it into your platform.**

**6-Customize and integrate your cross-chain checkout in minutes**

**Start accepting crypto subscriptions in 3 easy steps. Customize your checkout widget, export it as JSON or publish it to IPFS for a hosted link, and integrate it into your platform.**

i-Build widget: Customize every detail

ii-Export: Select most convenient option

iii-Integrate: Receive payment cross-chain second-by-second

**7-Watch your revenue grow in real-time.**
With a single transaction, your Web3 Subscriptions flow by the second into your wallet, reducing transaction costs and unlocking immediate capital availability.

It will help Web3 cloud infrastructure providers grow their business with frictionless subscriptions.


For the demo page, In as little as 3 clicks, users/customers can subscribe to their web3 product or service with money streams. Money streams flow in perpetuity, mitigating non-payment risk and reducing churn. 
-Web interface and dashboard for the Web3 company to check all the checkouts created, with the amount collected and being collected, their status and details from each customer.

**Web interface and dashboard for the customers to check the payments sent and being sent to the several buyers/suppliers with details and status**

## The key components of the POC (Proof-Of-Concept) we are building:

**AQUADUC Cross-chain streaming protocol:**
A collection of persistent, non-upgradeable smart contracts that together create a protocol that facilitates the streaming of assets that enables to make and collect payments in streams from one chain to another chain per second/minute/hour/day/month/etc...

**Cross-chain checkout builder Web interface**
built with a collection of persistent, upgradeable smart contracts that together create a protocol that enables the Web3 business to create and personalize its cross-chain checkout in minutes and export it on the IPFS or as JSON file.

**Web interface and dashboard for the Web3 company**
to check all the checkout created, with the amount collected and being collected, and details from their customers.

**Web interface and dashboard for the customers**
to check the payments sent and being sent to the several buyers/suppliers

For the back-end stack, we will use Solidity as programming language since we will build and deploy on EVM compatible chains such as the ones supported by Chainlink:

Ethereum
Polygon (Matic)
Polygon zkEVM
Avalanche

**Our tech stack will comprise the following:**

Chainlink CCIP
Chainlink Automation
Polygon - Polygon ID's Verifiable Credentials to preserve user privacy
ENS
The Graph

**We can use Forge for solidity?**

1- We can utilize ENS to help users select/attribute the domain name of the link of their cross-chain checkout while deploying on IPFS
2- We will use Polygon ID in our dapp so our users can prove access rights to dapp features without giving up their private data. It means that users while on Polygon Network will be able to connect and use the dapp without giving up their private data to Web3 businesses. 

![Untitled-2023-12-02-2212](https://github.com/MAJI-MVP/back-end/assets/125990317/e1cd2d85-1203-438c-953a-93926d5041c1)

# About

## USDC TOKEN ADDRESS
- Ethereum_Sepolia_LINK: 0x779877A7B0D9E8603169DdbD7836e478b4624789
- Polygon_Mumbai_USDC: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB

## Polygon Mumbai -> Etherum Spolia USDC
- Etherum_Spolia: 0xBA8F50375DBb23E39d6E6cEA711748beD65c162b LiquidityPool.sol
- Etherum_Spolia: 0x40a3D31Fe069F6Ca30CDfd8E0CA80c6946E34eb6 DestChainReceiver.sol
- Polygon_Mumbai: 0x4eb8c2c39BF1baA0850BAb49eeF5A6D874E68b08 SourceChainSender.sol

# Getting Started

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- hardhat


```
git clone https://github.com/MAJI-MVP/back-end.git
cd back-end
yarn install
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

1. Deploy LiquidityPool.sol on Ethereum Sepolia

```
yarn hardhat run scripts/01-deploy-lp.js --network sepolia
```

2. Deploy DestChainReceiver.sol on Ethereum Sepolia

```
yarn hardhat run scripts/02-deploy-receiver.js --network sepolia
```

3. TransferOwnership from LiquidityPool.sol to DestChainReceiver.sol address on Ethereum Sepolia.
   In order to ensure the security of the tokens in the LiquidityPool contract, we do not want anyone to be able to take away the tokens

```
yarn hardhat run scripts/03-transferowner.js --network sepolia  (Pass in the deployed DestChainReceiverAddress and liquidityPoolAddress)
```

4. Deploy SourceChainSender.sol on Polygon Mumbai

```
yarn hardhat run scripts/04-deploy-sender.js --network polygonMumbai
```

## Cross-chain 1 LINK
1. Build a liquidity pool contract: The project direction is to charge the target chain lp contract with cross-chain ERC20 tokens, such as 1 LINK

2. Pay the cross-chain fee: The project direction recharges the cross-chain fee to SourceChainSender.sol. Each cross-chain handling fee is approximately 0.3 LINK.

3. Initiate cross-chain: transfer 1 LINK in Polygon Mumbai by calling the fund function in the SourceChainSender.sol contract(approve first).
```
    uint64 destinationChainSelector, // 0x554472a2720e5e7d5d3c817529aba05eed5f82d8
    address receiver, // DestChainReceiver address
    payFeesIn feeToken, // 1
    address to, // user address
    uint256 amount // cross-chain amount
 ```

4. Chainlink Automation: Enter [Chainlink Automation Register]([https://ccip.chain.link/](https://automation.chain.link/mumbai/91891732584567093379112087924008345583205370880517803548581144994370026233926)) to create the Upkeep.
   And choose Custom Logic, put in to SourceChainSender.sol address.

5. Interact with SourceChainSender.sol, call createStream function.
   Check in Chainlink Automation Register copy transaction hash go to Chianlink Explorer.


 6. Chainlink Explorer: Enter [Chainlink CCIP Explorer](https://ccip.chain.link/) to view the cross-chain status
    Go to the metamask copy ```Transaction ID ```
