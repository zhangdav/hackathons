// imports
const { run, network, getNamedAccounts, ethers } = require("hardhat")

const liquidityPoolAddress = "0xa4064799b1BE7F708f1F75c44D863750f27A0a3E"
const routerAddress = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8"
// You can change to the `LP contract address` and `Router address` you deployed

// async main
async function main() {
    const { deployer } = await getNamedAccounts()
    const DestChainReceiverFactory = await ethers.getContractFactory(
        "DestChainReceiver"
    )
    console.log("Deploying contract...")
    const destChainReceiver = await DestChainReceiverFactory.deploy(
        routerAddress,
        liquidityPoolAddress
    )
    await destChainReceiver.deployed()
    console.log(`Deployed contract to: ${destChainReceiver.address}`)

    // Verify contract
    if (network.config.chainId === 43113 && process.env.SNOWTRACE_API_KEY) {
        console.log("Waiting for block confirmations...")
        await destChainReceiver.deployTransaction.wait(3)
        await verify(destChainReceiver.address, [
            routerAddress,
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
