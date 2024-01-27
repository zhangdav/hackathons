// imports
const { getNamedAccounts, ethers } = require("hardhat")

const liquidityPoolAddress = "0xBA8F50375DBb23E39d6E6cEA711748beD65c162b"
const receiverAddress = "0x40a3D31Fe069F6Ca30CDfd8E0CA80c6946E34eb6"
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
