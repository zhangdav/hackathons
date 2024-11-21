const { ethers, run } = require('hardhat');

async function main() {
  const endpointAddress = '0x6EDCE65403992e310A62460808c4b910D972f10f';
  const liquidationSimulatorAddress = '0x87A2F0232F77258cE89b459B7fe1E692f9b604aD';

  const FlashloanOApp = await ethers.getContractFactory('FlashloanOApp');
  const flashloanOApp = await FlashloanOApp.deploy(endpointAddress, liquidationSimulatorAddress);

  await flashloanOApp.deployed();

  console.log('Flashloan_OApp deployed to:', flashloanOApp.address);

  await flashloanOApp.deployTransaction.wait(5);

  try {
    await run("verify:verify", {
      address: flashloanOApp.address,
      constructorArguments: [endpointAddress],
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
