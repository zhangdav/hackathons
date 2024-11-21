// scripts/verifyPeerArbitrum.js
const { ethers } = require('hardhat');

async function main() {
  const baseEid = 40245; 
  const arbContractAddress = '0xb58333713250cc0DdE93b5ED58E696Eb51CD1e1B'; 

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
