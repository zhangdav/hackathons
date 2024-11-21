const { ethers } = require('hardhat');

async function main() {
  const endpointAddress = '0x6EDCE65403992e310A62460808c4b910D972f10f'; 

  const TreasuryOApp = await ethers.getContractFactory('TreasuryOApp');
  const treasuryOApp = await TreasuryOApp.deploy(endpointAddress);

  await treasuryOApp.deployed();

  console.log('Treasury_OApp deployed to:', treasuryOApp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
