require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {},
    base_sepolia: {
      url: process.env.BASE_SEPOLIA_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
    arb_sepolia: {
      url: process.env.ARBITRUM_SEPOLIA_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: {
      base_sepolia: process.env.BASE_ETHERSCAN_API_KEY,
      arb_sepolia: process.env.ARBITRUM_ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "base_sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org", 
        }
      },
      {
        network: "arb_sepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api", 
          browserURL: "https://testnet.arbiscan.io" 
        }
      },
    ],
  },
};
