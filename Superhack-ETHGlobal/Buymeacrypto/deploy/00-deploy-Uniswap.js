const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")

    const arguments = []
    // LDO
    const lodo = await deploy("LdoPair", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    // LINK
    const link = await deploy("LinkPair", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    // SNX
    const snx = await deploy("SnxPair", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    // WBTC
    const wbtc = await deploy("WbtcPair", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...")
        await verify(lodo.address, arguments)
        await verify(link.address, arguments)
        await verify(snx.address, arguments)
        await verify(wbtc.address, arguments)
    }
}

module.exports.tags = ["all", "uniswap", "main"]
