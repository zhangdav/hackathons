const { ethers } = require('hardhat');

async function main() {
    const baseContractAddress = "0x974ace0d3C64529Eaa76599C785b7574F40F49Bc"; 
    const arbContractAddress = "0xb58333713250cc0DdE93b5ED58E696Eb51CD1e1B"; 
    const arbEid = 40231; 

    const baseContract = await ethers.getContractAt('MyOFT', baseContractAddress);
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
