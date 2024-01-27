// imports
import { network, ethers } from "hardhat";
import verify from "../utils/verify";

// async main
async function main() {
  const CrossChainNftFactory = await ethers.getContractFactory("CrossChainNft");
  console.log("Deploying contract...");
  const crossChainNft = await CrossChainNftFactory.deploy("Happy Planet", "HP");
  await crossChainNft.deployed();
  console.log(`Deployed contract to: ${crossChainNft.address}`);

  // Verify contract
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying...");
    await crossChainNft.deployTransaction.wait(3);
    await verify(crossChainNft.address, ["Happy Planet", "HP"]);
  }
}
// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
