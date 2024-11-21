// scripts/verifyPeerArbitrum.js
const { ethers } = require('hardhat');

async function main() {
  const baseEid = 40245; 
  const arbContractAddress = '0xD6e47b0B7559567B918e9619A03d4857521425a3'; 

  const arbContract = await ethers.getContractAt('FlashloanOApp', arbContractAddress);

  const peerBytes32 = await arbContract.peers(baseEid);
  const peerAddress = ethers.utils.getAddress('0x' + peerBytes32.slice(-40));

  console.log(`Peer address on Arbitrum contract for Base EID (${baseEid}): ${peerAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error verifying Arbitrum Peer:', error);
    process.exit(1);
  });
