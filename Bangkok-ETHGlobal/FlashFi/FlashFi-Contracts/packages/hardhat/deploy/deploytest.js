const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function saveDeployments(chainId, deployments) {
    const deploymentsPath = path.join(__dirname, '../deployments.json');
    let allDeployments = {};
    
    if (fs.existsSync(deploymentsPath)) {
      allDeployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
    }
  
    allDeployments[chainId] = deployments;
    fs.writeFileSync(deploymentsPath, JSON.stringify(allDeployments, null, 2));
  }

async function main() {

    try {
  // Deploy USDT with error handling
  console.log("\nDeploying ...");
  const USDT = await ethers.getContractFactory("USDT");
  const usdt = await USDT.deploy();
  await usdt.waitForDeployment();
  console.log("USDT deployed to:", usdt.target);

  // Deploy Token
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.waitForDeployment();
    console.log("Token deployed to:", token.target);

    // Deploy Factory
    const Factory = await ethers.getContractFactory("FlashMultisigFactory");
    const factory = await Factory.deploy();
    await factory.waitForDeployment();
    console.log("Factory deployed to:", factory.target);

// Deploy new DaoMultiSig through factory
const owners = ["0xe2b8651bF50913057fF47FC4f02A8e12146083B8"];
const requiredConfirmations = 1;
const deployTx = await factory.deployNewMultisig(owners, requiredConfirmations);
const receipt = await deployTx.wait();

// Debugging: Log the entire receipt
// console.log("Transaction receipt:", receipt);
// console.log("Receipt logs:", receipt.logs);

let multisigAddress
// Get deployed multisig address from event
const event = receipt.logs.find(log => log.fragment.name === 'MultisigDeployed');
if (event) {
    multisigAddress = event.args[0];
    console.log("DaoMultiSig deployed to:", multisigAddress);

    // Create contract instance for the deployed multisig
    const DaoMultiSig = await ethers.getContractFactory("DaoMultiSig");
    const daoMultisig = DaoMultiSig.attach(multisigAddress);

    // Mint tokens
    await usdt.mint();
    await token.mint();

    // Transfer tokens to multisig - increase amounts
    const usdtAmount = ethers.parseEther("30000000"); // Increased amount
    const tokenAmount = ethers.parseEther("30000000"); // Increased amount

    await usdt.transfer(multisigAddress, usdtAmount);
    await token.transfer(multisigAddress, tokenAmount);

    // Add token support to multisig with lower fee
    const multisigFee = 1; // 0.01% fee instead of 0.1%
    await daoMultisig.addToken(usdt.target, multisigFee);
    await daoMultisig.addToken(token.target, multisigFee);

    // Deploy DEX
    const GenericDex = await ethers.getContractFactory("GenericDex");
    const dex = await GenericDex.deploy();
    await dex.waitForDeployment();
    console.log("DEX deployed to:", dex.target);

    // Setup DEX with even more favorable rates
    const rateAtoB = BigInt("1100000000000000000"); // 1 TokenA = 10 percent gain
    const rateBtoA = BigInt("1100000000000000000"); // 1 TokenB = 10 percent gain

    // Approve larger amounts
    await token.approve(dex.target, BigInt("1000000000000000000000000000"));
    await usdt.approve(dex.target, BigInt("1000000000000000000000000000"));

    // Add more liquidity to DEX
    await dex.addTokenPairWithDeposit(
        await token.target,
        await usdt.target,
        rateAtoB,
        rateBtoA,
        ethers.parseEther("10000000"),
        ethers.parseEther("10000000")
    );

    console.log("Balance of Token in DEX:", ethers.formatEther(await token.balanceOf(dex.target)));
    console.log("Balance of USDT in DEX:", ethers.formatEther(await usdt.balanceOf(dex.target)));

    // Deploy Liquidation Simulator
    const LiquidationSimulator = await ethers.getContractFactory("LiquidationSimulator");
    simulator = await LiquidationSimulator.deploy(
        multisigAddress,
        await dex.target
    );
    await simulator.waitForDeployment();
    console.log("LiquidationSimulator deployed to:", simulator.target);

    // Calculate required profit tokens and transfer them to simulator
    const flashLoanAmount = ethers.parseEther("100000");
    const flashLoanFee = (flashLoanAmount * BigInt(100)) / BigInt(10000); // Using multisigFee (0.01%)
    const repayAmount = flashLoanAmount + flashLoanFee;
    
    // Get required profit tokens for swap
    const swapAmount = await dex.previewSwap(
        token.target,
        usdt.target,
        repayAmount
    );
    console.log("Required profit tokens:", ethers.formatEther(swapAmount));

    // Transfer profit tokens to simulator
    await token.transfer(simulator.target, swapAmount);
    console.log("Simulator profit token balance:", ethers.formatEther(await token.balanceOf(simulator.target)));

    // Execute liquidation
    await simulator.simulateLiquidation(
        usdt.target,
        token.target,
        flashLoanAmount
    );
    console.log("Liquidation successful");

// Save deployments with network info
const deployments = {
    networkName: network.name,
    chainId: network.chainId,
    usdt: usdt.target,
    token: token.target,
    factory: factory.target,
    daoMultisig: multisigAddress,
    dex: dex.target,
    flashloan: simulator.target,
  };

  await saveDeployments(network.chainId, deployments);
  console.log("Deployments saved to deployments.json");

  // We borrow USDT to pay back loans so check profit
  console.log("DaoSig Earnings:", await daoMultisig.accumulatedFees(usdt.target));



  // run the flashloan again

  const flashLoanAmounts = [
    ethers.parseEther("200"),
    ethers.parseEther("400"),
    ethers.parseEther("600"),
    ethers.parseEther("800")
    ];
    
    for (let i = 0; i < flashLoanAmounts.length; i++) {
        const amount = flashLoanAmounts[i];
      
    
        // Execute liquidation
    await simulator.simulateLiquidation(
        usdt.target,
        token.target,
        flashLoanAmount
    );


    }

    // Get accumulated fees from contract (using public mapping)
    const contractFees = await daoMultisig.accumulatedFees(usdt.target);
    console.log("New fees after flashloan", contractFees);
}


} catch (error) {
    console.error("\nDeployment failed!");
    console.error("Error details:", error);
    
    if (error.message.includes("network connection")) {
      console.error("\nPossible solutions:");
      console.error("1. Check if your RPC URL is correct in .env file");
      console.error("2. Verify network connection");
      console.error("3. Make sure you're connected to the right network");
    }
    
    process.exit(1);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
