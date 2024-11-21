const { ethers } = require('hardhat');

async function main() {
    const baseContractAddress = "0x89E5B8aFE37acce001c39441A379A0cd9579b93e"; 
    const arbContractAddress = "0xaa5A117785Fbb955664956A1E4aD8CAD783596B1"; 
    const arbEid = 40231; 

    const baseContract = await ethers.getContractAt('TreasuryOApp', baseContractAddress);
    const arbContractAddressBytes32 = ethers.utils.hexZeroPad(arbContractAddress, 32);
    
    console.log(arbContractAddressBytes32);

    const tx = await baseContract.setPeer(arbEid, arbContractAddressBytes32);
    await tx.wait(); 
    console.log('Arbitrum peer set on Base chain.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
