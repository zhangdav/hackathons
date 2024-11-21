const { ethers } = require('hardhat');

async function main() {
const endpointAddress = '0x6EDCE65403992e310A62460808c4b910D972f10f'; 
const name = 'MyOFT Token';
  const symbol = 'MOFT';

  const MyOFT = await ethers.getContractFactory('MyOFT');
  const myOft = await MyOFT.deploy(name, symbol, endpointAddress, "0x6EDCE65403992e310A62460808c4b910D972f10f");

  await myOft.deployed();

  console.log('MyOFT deployed to:', myOft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });