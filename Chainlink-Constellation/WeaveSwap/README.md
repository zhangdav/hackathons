# WeaveSwap: Cross-Chain Swap Application

WeaveSwap is a decentralized cross-chain swap application developed as part of the Chainlink Hackathon. The platform leverages Chainlink technology to enable seamless and secure swapping of assets across different blockchain networks.

<img width="1403" alt="image" src="https://github.com/Solidityarchitect/Hackathon-Portfolio/assets/125990317/d1b930b7-48a8-4679-ad13-7a53c23c45a8">

[![David Zhang YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=WkyqA-yN4OU&t=2s)

## Chianlink Hackathon Constellation:
<br/>
<p align="center">
<a href="https://devpost.com/software/weaveswap?ref_content=user-portfolio&ref_feature=in_progress" target="_blank">
<img src="https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/docs/logo-chainlink-blue.svg" width="225" alt="Chainlink logo">
</a>
</p>
<br/>

## Features

- **Cross-Chain Compatibility:** WeaveSwap supports the exchange of tokens/assets across various blockchain networks, providing users with flexibility and interoperability.
- **User-Friendly Interface:** An intuitive interface designed to simplify the swapping process for both novice and experienced users.
- **Security:** WeaveSwap prioritizes security, employing industry best practices and smart contract audits to ensure a safe swapping environment.

## Challenges

- **Cross-Chain Interoperability Protocol (CCIP):** Implementing a robust Cross-Chain Interoperability Protocol posed significant challenges. Ensuring compatibility and efficient communication between disparate blockchain networks required intricate protocol design and careful consideration of various consensus mechanisms and token standards.
- **Standardization Hurdles:** Overcoming the lack of standardized formats for data transmission and transaction execution across multiple blockchains was a persistent challenge. Achieving seamless interaction and asset transfer between distinct protocols required extensive research and implementation efforts.
- **Protocol Security and Consistency:** Maintaining security while ensuring consistent transactional behavior across different chains introduced complexities. Addressing potential vulnerabilities and ensuring the reliability of cross-chain transactions demanded rigorous testing and analysis.

## Learnings

- **CCIP Dynamics:** Navigating the complexities of Cross-Chain Interoperability Protocols provided invaluable insights into the intricacies of blockchain communication and interoperability. Understanding CCIP standards and their impact on decentralized applications deepened our knowledge base.
- **Standardization Efforts:** Overcoming hurdles related to non-standardized formats enhanced our appreciation for the significance of protocol standardization. Exploring interoperability solutions helped identify best practices for seamless data transmission and transaction execution.
- **Security in Cross-Chain Environments:** Addressing security concerns and maintaining transactional consistency across different chains enriched our understanding of secure cross-chain interactions. Implementing measures to mitigate risks in decentralized cross-chain environments became a priority focus area.

## Tech Stack

- **Smart Contracts:** Solidity, Chainlink , CCIP
- **Frontend:** Next.js, Redux,Tailwind
- **Backend:** Node.js (or relevant backend technology)
- **Blockchain Networks:** Right now for hackathon purpose we have completed all chains from and to sepolia

## Getting Started


### Installation

#### Frontend

The frontend code resides in the `frontend` folder of this repository.

1. **Navigate to the Frontend Directory:**

   ```bash
   cd frontend 
   ```

    ```bash
   cd weaveswap-master
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   This command starts the development server, allowing you to access the WeaveSwap interface at `http://localhost:3000`.

#### Smart Contracts

For accessing and working with the smart contracts, follow these steps:

1. **Hardhat Configuration Files:**

   - Smart contracts are located in the `contracts` directory.
   - Hardhat configuration files can be found in the `hardhat` directory.

2. **Install Hardhat and Dependencies:**

   Ensure you have Hardhat installed globally:

   ```bash
   npm install -g hardhat
   ```

3. **Compile Smart Contracts:**

   Run the following command to compile the smart contracts:

   ```bash
   npx hardhat compile
   ```

4. **Run Tests (Optional):**

   To execute tests, if available:

   ```bash
   npx hardhat test
   ```

5. **Deployment and Interaction:**

   Use Hardhat scripts or deploy scripts provided in the repository to deploy contracts to your preferred network (local, testnet, or mainnet). Update the Hardhat configuration files (`hardhat.config.js`) with the necessary network details.

   For instance, to deploy on a local network:

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

   Consult the respective documentation or scripts provided in the repository for specific deployment and interaction commands.

### Usage

- Access the WeaveSwap platform through the provided interface.
- Connect your wallet (MetaMask, etc.) to the supported blockchain network.
- Select the tokens/assets you want to swap and initiate the transaction.
- Confirm the transaction details and complete the swap.


## License

This project is licensed under the [MIT License](link-to-license).

## Acknowledgements

WeaveSwap has been developed by 4 developers from different parts of the world 
- David Zhang
- Matt Sampson
- N Divij
- Olawande Armstrong
