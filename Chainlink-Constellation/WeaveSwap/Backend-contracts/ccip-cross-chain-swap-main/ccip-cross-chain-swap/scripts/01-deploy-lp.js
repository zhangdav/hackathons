// imports
const { run, network, getNamedAccounts, ethers } = require("hardhat")

const linkTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789"
const FUND_AMOUNT = ethers.utils.parseEther("1")

// async main
async function main() {
    const { deployer } = await getNamedAccounts()
    const linkContract = await ethers.getContractAt("ERC20", linkTokenAddress)
    const LiquidityPoolFactory = await ethers.getContractFactory(
        "LiquidityPool"
    )
    console.log("Deploying contract...")
    const liquidityPool = await LiquidityPoolFactory.deploy(linkTokenAddress)
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
        `Liquidity pool balance: ${ethers.utils.formatEther(
            liquidityPoolBalance
        )} LINK`
    )

    // Verify contract
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await liquidityPool.deployTransaction.wait(3)
        await verify(liquidityPool.address, [linkTokenAddress])
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