const { ethers } = require('hardhat');

async function main() {
    const arbContractAddress = "0xb58333713250cc0DdE93b5ED58E696Eb51CD1e1B"; 
    const baseContractAddress = "0x974ace0d3C64529Eaa76599C785b7574F40F49Bc"; 
    const baseEid = 40245; 

    const arbContract = await ethers.getContractAt('MyOFT', arbContractAddress);
    const baseContractAddressBytes32 = ethers.utils.hexZeroPad(baseContractAddress, 32);
    
    console.log(baseContractAddressBytes32);

    const tx = await arbContract.setPeer(baseEid, baseContractAddressBytes32);
    await tx.wait(); 
    console.log('Base peer set on Arbitrum chain.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
