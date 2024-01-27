// imports
const { getNamedAccounts, ethers } = require("hardhat")

const liquidityPoolAddress = "0xa4064799b1BE7F708f1F75c44D863750f27A0a3E"
const receiverAddress = "0x4Ad8C9b33a5dDd7A4762948153Ebd43Bcf8E91Ad"
// You can change to the `LP contract address` and `Router address` you deployed

// async main
async function main() {
    const { deployer } = await getNamedAccounts()
    const liquidityPoolContract = await ethers.getContractAt(
        "LiquidityPool",
        liquidityPoolAddress,
        deployer
    )

    console.log(`transfer ownership to ${receiverAddress}...`)

    const transferOwnerTx = await liquidityPoolContract.transferOwnership(
        receiverAddress
    )
    await transferOwnerTx.wait(1)
    console.log(`transfer successful!`)
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
