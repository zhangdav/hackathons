const { ethers } = require('hardhat');

async function main() {
  const arbEid = 40231; 
  const baseContractAddress = '0x974ace0d3C64529Eaa76599C785b7574F40F49Bc'; 

  const code = await ethers.provider.getCode(baseContractAddress);
  if (code === '0x') {
    throw new Error(`contract address at ${baseContractAddress} does not exist`);
  }

  const baseContract = await ethers.getContractAt('TreasuryOApp', baseContractAddress);

  const peerBytes32 = await baseContract.peers(arbEid);
  const peerAddress = ethers.utils.getAddress('0x' + peerBytes32.slice(-40));

  console.log(`Base 合约上针对 Arbitrum EID (${arbEid}) 的 Peer 地址：${peerAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('验证 Base Peer 时出错:', error);
    process.exit(1);
  });
