// imports
const { run, network, getNamedAccounts, ethers } = require("hardhat")

const linkTokenAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"
const fujiRouter = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8"
const rossChainToken = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"
// You can change to you deployed
const FUND_AMOUNT = ethers.utils.parseEther("0.5")

// async main
async function main() {
    const { deployer } = await getNamedAccounts()
    const linkContract = await ethers.getContractAt("ERC20", linkTokenAddress)
    const SourceChainSenderFactory = await ethers.getContractFactory(
        "SourceChainSender"
    )
    console.log("Deploying contract...")
    const sourceChainSender = await SourceChainSenderFactory.deploy(
        fujiRouter,
        linkTokenAddress,
        rossChainToken
    )
    await sourceChainSender.deployed()
    console.log(`Deployed contract to: ${sourceChainSender.address}`)

    // Transfer 0.5 LINK token to the SourceChainSender as feeToken
    const approveTx = await linkContract.approve(
        sourceChainSender.address,
        FUND_AMOUNT
    )
    await approveTx.wait(1)
    const fundTx = await sourceChainSender.fund(FUND_AMOUNT)
    await fundTx.wait(1)

    const sourceChainSenderBalance = await linkContract.balanceOf(
        sourceChainSender.address
    )
    console.log(
        `Sender has balance: ${ethers.utils.formatEther(
            sourceChainSenderBalance
        )} LINK`
    )

    // Verify contract
    if (network.config.chainId === 43113 && process.env.SNOWTRACE_API_KEY) {
        console.log("Waiting for block confirmations...")
        await sourceChainSender.deployTransaction.wait(3)
        await verify(sourceChainSender.address, [
            fujiRouter,
            linkTokenAddress,
            rossChainToken,
        ])
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