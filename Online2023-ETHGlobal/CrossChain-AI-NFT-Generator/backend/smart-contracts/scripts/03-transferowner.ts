// imports
import { getNamedAccounts, ethers } from "hardhat";

const crossChainNftAddress = "0xc03EE86385D462Cca092B43EEf307262eF940940";
const receiverAddress = "0x8d8624f4E142aD80423EB7E6424CF0d69672C6fc";

// async main
async function main() {
  const { deployer } = await getNamedAccounts();
  const signer = await ethers.getSigner(deployer);
  const crossChainNftContract = await ethers.getContractAt(
    "CrossChainNft",
    crossChainNftAddress,
    signer
  );

  console.log(`transfer ownership to ${receiverAddress}...`);

  const transferOwnerTx = await crossChainNftContract.transferOwnership(
    receiverAddress
  );
  await transferOwnerTx.wait(1);
  console.log(`transfer successful!`);
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
