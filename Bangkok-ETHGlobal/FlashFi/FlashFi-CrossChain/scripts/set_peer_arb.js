const { ethers } = require('hardhat');

async function main() {
    const arbContractAddress = "0xaa5A117785Fbb955664956A1E4aD8CAD783596B1"; 
    const baseContractAddress = "0x89E5B8aFE37acce001c39441A379A0cd9579b93e"; 
    const baseEid = 40245; 

    const arbContract = await ethers.getContractAt('TreasuryOApp', arbContractAddress);
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
