const { ethers } = require('hardhat');

async function main() {
    const arbContractAddress = "0xD6e47b0B7559567B918e9619A03d4857521425a3"; 

    const arbContract = await ethers.getContractAt('FlashloanOApp', arbContractAddress);
    
    const count = await arbContract.count();
    console.log(count);

    const data = await arbContract.data();
    console.log(data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
