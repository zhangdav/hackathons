import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy USDT
  const usdt = await deploy("USDT", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy Token
  const token = await deploy("Token", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy Factory
  const factory = await deploy("FlashMultisigFactory", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get contract instances
  const usdtContract = await hre.ethers.getContract("USDT", deployer);
  const tokenContract = await hre.ethers.getContract("Token", deployer);
  const factoryContract = await hre.ethers.getContract("FlashMultisigFactory", deployer);

  // Deploy new DaoMultiSig through factory
  const owners = [deployer];
  const requiredConfirmations = 1;
  
  const deployTx = await factoryContract.deployNewMultisig(
    owners,
    requiredConfirmations
  );
  const receipt = await deployTx.wait();
  
  // Get the deployed DaoMultiSig address from events
  const daoSigAddress = receipt.events?.[0].args?.multisigAddress;
  console.log("DaoMultiSig deployed to:", daoSigAddress);

  // Get DaoMultiSig instance
  const daoSig = await hre.ethers.getContractAt("DaoMultiSig", daoSigAddress);

  // Transfer tokens to DaoMultiSig
  await usdtContract.transfer(daoSigAddress, "1000000000000"); // 1M USDT
  await tokenContract.transfer(daoSigAddress, "1000000000000000000000000"); // 1M TKN

  // Add tokens to supported list (0.1% fee)
  await daoSig.addToken(usdt.address, 10);
  await daoSig.addToken(token.address, 10);

  console.log("Setup complete!");
};

export default deployContracts;

deployContracts.tags = ["All", "DaoSig"];