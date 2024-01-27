// imports
const { run, network, getNamedAccounts, ethers } = require("hardhat")

const liquidityPoolAddress = "0xBA8F50375DBb23E39d6E6cEA711748beD65c162b"
const routerAddress = "0xd0daae2231e9cb96b94c8512223533293c3693bf"
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
    if (network.config.chainId === 11155111 && process.env.SNOWTRACE_API_KEY) {
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
