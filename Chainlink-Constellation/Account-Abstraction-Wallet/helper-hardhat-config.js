const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    11155111: {
        name: "sepolia",
        linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        routerAddress: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
    },
    143113: {
        name: "mainnet",
        routerAddress: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
        linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
        crossChainToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    },
    80001: {
        name: "mumbai",
        routerAddress: "0x70499c328e1e2a3c41108bd3730f6670a44595d1",
        linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        crossChainToken: "0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
