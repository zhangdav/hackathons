// imports
import { network, ethers } from "hardhat"
import verify from "../utils/verify"

// async main
async function main() {
    const HPTokenFactory = await ethers.getContractFactory("HPToken")
    console.log("Deploying contract...")
    const hpToken = await HPTokenFactory.deploy()
    await hpToken.deployed()
    console.log(`Deployed contract to: ${hpToken.address}`)

    // Verify contract
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await hpToken.deployTransaction.wait(3)
        await verify(hpToken.address, [])
    }
}
// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
