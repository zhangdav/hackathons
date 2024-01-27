// imports
import { network, ethers, getNamedAccounts } from "hardhat"
import verify from "../utils/verify"

const hpTokenAddress = "0x76E6B410A3251912866C8Cd45C2e56D9Eb209961"

// async main
async function main() {
    const VendorFactory = await ethers.getContractFactory("Vendor")
    console.log("Deploying contract...")
    const vendor = await VendorFactory.deploy(hpTokenAddress)
    await vendor.deployed()
    console.log(`Deployed contract to: ${vendor.address}`)

    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    const hpToken = await ethers.getContractAt("HPToken", hpTokenAddress, signer)

    console.log(`transfer HP Token to ${vendor.address}...`)

    const transferTx = await hpToken.transfer(
        vendor.address,
        ethers.utils.parseEther("99999999999999999999999"),
    )
    await transferTx.wait(1)
    console.log(`transfer successful!`)
    // 0x4efCD17DFb7Fd3Ab0b48E10E8C37bc5dcA729fd4

    // Verify contract
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await vendor.deployTransaction.wait(3)
        await verify(vendor.address, [hpTokenAddress])
    }
}
// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
