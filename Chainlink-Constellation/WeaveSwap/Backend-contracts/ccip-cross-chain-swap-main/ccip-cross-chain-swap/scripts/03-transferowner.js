// imports
const { getNamedAccounts, ethers } = require("hardhat")

const liquidityPoolAddress = "0x459FeECB0c0Cf74Be0e9e0E3978B2816821de800"
const receiverAddress = "0x04B8C373e97a906e23d11123f047b2E2342cd9F1"
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