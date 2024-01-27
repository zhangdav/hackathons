const networkConfig = {
    31337: {
        name: "localhost",
    },

    11155111: {
        name: "sepolia",
    },
    5: {
        name: "Goerli",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
