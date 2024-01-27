// imports
import { network, ethers } from "hardhat";
import verify from "../utils/verify";

const linkTokenAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";
const fujiRouter = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";
const hpTokenAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";
const costETH = "10000000000000000";
const costToken = "10000000000000000";

// async main
async function main() {
  const SourceChainSenderFactory = await ethers.getContractFactory(
    "SourceChainSender"
  );
  console.log("Deploying contract...");
  const sourceChainSender = await SourceChainSenderFactory.deploy(
    fujiRouter,
    linkTokenAddress,
    hpTokenAddress,
    costETH,
    costToken
  );
  await sourceChainSender.deployed();
  console.log(`Deployed contract to: ${sourceChainSender.address}`);

  // Verify contract
  if (network.config.chainId === 43113 && process.env.SNOWTRACE_API_KEY) {
    console.log("Verifying...");
    await sourceChainSender.deployTransaction.wait(3);
    await verify(sourceChainSender.address, [
      fujiRouter,
      linkTokenAddress,
      hpTokenAddress,
      costETH,
      costToken,
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
