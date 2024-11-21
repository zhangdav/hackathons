const { ethers, run } = require('hardhat');

async function main() {

  const LiquidationSimulator = await ethers.getContractFactory('LiquidationSimulator');
  const liquidationSimulator = await LiquidationSimulator.deploy();

  await liquidationSimulator.deployed();

  console.log('LiquidationSimulator deployed to:', liquidationSimulator.address);

  await liquidationSimulator.deployTransaction.wait(5);

  try {
    await run("verify:verify", {
      address: liquidationSimulator.address,
      constructorArguments: [],
    });
    console.log('Verification successful');
  } catch (error) {
    console.error('Error verifying contract:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
