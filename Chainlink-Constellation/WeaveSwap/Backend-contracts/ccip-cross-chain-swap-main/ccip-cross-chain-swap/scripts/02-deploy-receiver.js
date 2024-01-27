// imports
const { run, network, getNamedAccounts, ethers } = require("hardhat")

const liquidityPoolAddress = "0x459FeECB0c0Cf74Be0e9e0E3978B2816821de800"
const sepoliaRouter = "0xd0daae2231e9cb96b94c8512223533293c3693bf"
// You can change to the `LP contract address` and `Router address` you deployed

// async main
async function main() {
    const { deployer } = await getNamedAccounts()
    const DestChainReceiverFactory = await ethers.getContractFactory(
        "DestChainReceiver"
    )
    console.log("Deploying contract...")
    const destChainReceiver = await DestChainReceiverFactory.deploy(
        sepoliaRouter,
        liquidityPoolAddress
    )
    await destChainReceiver.deployed()
    console.log(`Deployed contract to: ${destChainReceiver.address}`)

    // Verify contract
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await destChainReceiver.deployTransaction.wait(3)
        await verify(destChainReceiver.address, [
            sepoliaRouter,
            liquidityPoolAddress,
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