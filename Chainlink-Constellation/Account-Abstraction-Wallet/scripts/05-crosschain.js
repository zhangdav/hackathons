// imports
const { getNamedAccounts, ethers } = require("hardhat")

const sourceChainSenderAddress = "0x4faE92E949Ed605b9ac9E7ee1cdCA164CF54410E"
const usdcContractAddress = "0x5425890298aed601595a70AB815c96711a31Bc65"
const FUND_AMOUNT = ethers.utils.parseUnits("1", 6)
const destinationChainSelector = "12532609583862916517" // Polygon Mumbai
const receiver = "0x4De984c203109756eb6365a696037E599dCd973C"
const feeToken = "1"
const to = "0xeb23E1a2784931A65D671DaA1235c8ae6435A367"
const amount = "1000000"

// async main
async function main() {
    const { deployer } = await getNamedAccounts()
    const sourceChainSender = await ethers.getContractAt(
        "SourceChainSender",
        sourceChainSenderAddress,
        deployer
    )
    const usdcContract = await ethers.getContractAt(
        "ERC20",
        usdcContractAddress
    )

    // Transfer 1 USDC token to the SourceChainSender as cross chain token
    const approveTx = await usdcContract.approve(
        sourceChainSender.address,
        FUND_AMOUNT
    )
    await approveTx.wait(1)

    console.log("fund 1 USDC to SourceChainSender Contract...")
    const fundTx = await sourceChainSender.fund(FUND_AMOUNT, {
        gasLimit: 1000000,
    })
    await fundTx.wait(1)

    console.log("transaction successfully...")

    const balance = await usdcContract.balanceOf(deployer)
    console.log(
        `Deployer has balance: ${ethers.utils.formatEther(balance)} USDC`
    )

    // Call the sendMessage function to cross-chain 1 USDC to Mumbai
    console.log("Call sendMessage function...")
    const crossChainTx = await sourceChainSender.sendMessage(
        destinationChainSelector,
        receiver,
        feeToken,
        to,
        amount
    )
    console.log(`Cross-chain transaction hash: ${crossChainTx.hash}`) // copy it to Chainlink CCIP Explorer page, check cross chain status.
    await crossChainTx.wait(1)
    console.log(
        "Cross Chain 1 USDC from Avalanche Fuji to Polygon Mumbai is successfully!"
    )
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
