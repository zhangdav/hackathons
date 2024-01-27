// imports
import { network, ethers } from "hardhat";
import verify from "../utils/verify";

const crossChainNftAddress = "0xc03EE86385D462Cca092B43EEf307262eF940940";
const sepoliaRouter = "0xd0daae2231e9cb96b94c8512223533293c3693bf";

// async main
async function main() {
  const DestChainReceiverFactory = await ethers.getContractFactory(
    "DestChainReceiver"
  );
  console.log("Deploying contract...");
  const destChainReceiver = await DestChainReceiverFactory.deploy(
    sepoliaRouter,
    crossChainNftAddress
  );
  await destChainReceiver.deployed();
  console.log(`Deployed contract to: ${destChainReceiver.address}`);

  // Verify contract
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying...");
    await destChainReceiver.deployTransaction.wait(3);
    await verify(destChainReceiver.address, [
      sepoliaRouter,
      crossChainNftAddress,
    ]);
  }
}
// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
