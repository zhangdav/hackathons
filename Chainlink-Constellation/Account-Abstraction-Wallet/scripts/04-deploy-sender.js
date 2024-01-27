// imports
const { run, network, getNamedAccounts, ethers } = require("hardhat")

const linkTokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
const fujiRouter = "0x70499c328e1e2a3c41108bd3730f6670a44595d1"
const rossChainToken = "0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97"
// You can change to you deployed
const FUND_AMOUNT = ethers.utils.parseEther("1")

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

    // Transfer 1 LINK token to the SourceChainSender as feeToken
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
    if (network.config.chainId === 80001 && process.env.MUMBAI_RPC_URL) {
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
