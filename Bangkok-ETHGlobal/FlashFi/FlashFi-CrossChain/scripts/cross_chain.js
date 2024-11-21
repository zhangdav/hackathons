const { ethers } = require('hardhat');
const { Options } = require('@layerzerolabs/lz-v2-utilities');

async function main() {
    const arbEid = 40231; 
    const baseContractAddress = "0x89E5B8aFE37acce001c39441A379A0cd9579b93e"; 
    const gasDropInWeiOnDestChain = "0";
    const executorLzReceiveOptionMaxGas = "200000";
    const receivingAccountAddress = "0xC97705a8FaA9Bec2A50B5bbCc0661251BcB537A4";

    const borrowToken = "0xC97705a8FaA9Bec2A50B5bbCc0661251BcB537A4"; 
    const profitToken = "0xC97705a8FaA9Bec2A50B5bbCc0661251BcB537A4"; 
    const borrowAmount = "800000000"; 

    const message = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256"],
        [borrowToken, profitToken, borrowAmount]
    );

    const baseContract = await ethers.getContractAt('TreasuryOApp', baseContractAddress);

    const options = Options.newOptions()
        .addExecutorNativeDropOption(gasDropInWeiOnDestChain, receivingAccountAddress)
        .addExecutorLzReceiveOption(executorLzReceiveOptionMaxGas, 0)
        .toHex()
        .toString();

    const tx = await baseContract.send(
        arbEid,
        message, 
        options,
        { 
            gasLimit: 500000,  
            value: ethers.utils.parseEther("0.001") 
        }
    );

    console.log('Transaction hash:', tx.hash);

    await tx.wait();
    console.log('Cross-chain message sent successfully!');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
