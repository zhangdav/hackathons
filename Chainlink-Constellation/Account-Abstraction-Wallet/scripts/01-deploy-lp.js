// imports
const { run, network, getNamedAccounts, ethers } = require("hardhat")

const tokenAddress = "0x5425890298aed601595a70AB815c96711a31Bc65"
const FUND_AMOUNT = ethers.utils.parseUnits("1", 6)

// async main
async function main() {
    const { deployer } = await getNamedAccounts()
    const linkContract = await ethers.getContractAt("ERC20", tokenAddress)
    const LiquidityPoolFactory = await ethers.getContractFactory(
        "LiquidityPool"
    )
    console.log("Deploying contract...")
    const liquidityPool = await LiquidityPoolFactory.deploy(tokenAddress)
    await liquidityPool.deployed()
    console.log(`Deployed contract to: ${liquidityPool.address}`)

    // Transfer 1 LINK token to the liquidity pool
    const approveTx = await linkContract.approve(
        liquidityPool.address,
        FUND_AMOUNT
    )
    await approveTx.wait(1)
    const depositTx = await liquidityPool.depositToken(FUND_AMOUNT)
    await depositTx.wait(1)

    const liquidityPoolBalance = await linkContract.balanceOf(
        liquidityPool.address
    )
    console.log(
        `Deployer balance: ${ethers.utils.formatUnits(
            liquidityPoolBalance,
            6
        )} USDC`
    )

    // Verify contract
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await liquidityPool.deployTransaction.wait(3)
        await verify(liquidityPool.address, [tokenAddress])
    }
}

// Verify
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
