import { ethers } from "ethers";

import { xmtpClient, HandlerContext, SkillResponse } from "@xmtp/message-kit";
//import { getUserInfo, clearInfoCache, isOnXMTP } from "@xmtp/message-kit";
import { isAddress } from "viem";

const FACTORY_ADDRESS = "0x9FBe9D872df9701108fD2d33d96383269DC059fb"; // Deployed factory address on Mantle Sepolia
const FACTORY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "multisigAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "owners",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requiredConfirmations",
        type: "uint256",
      },
    ],
    name: "MultisigDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_owners",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_requiredConfirmations",
        type: "uint256",
      },
    ],
    name: "deployNewMultisig",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const RPC_URL = "https://rpc.sepolia.mantle.xyz";


//const provider = new ethers.providers.Web3Provider(window.ethereum);
const provider = new ethers.JsonRpcProvider(RPC_URL);
// const signer = provider.getSigner(); // Ensure this is replaced with a valid signer
const signer = new ethers.Wallet(
  "a1fd1aaafec01bd86ea80ccbe856168b2ecdd7ead53c764ac6e1f7ff4864452e",
  provider
);

const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

export async function handleMultisig(
  context: HandlerContext
): Promise<SkillResponse | undefined> {
  const {
    message: {
      sender,
      content: { skill, params },
    },
  } = context;
  console.log(skill, params);
  if (skill == "create") {
    const { owners, requiredConfirmations } = params;
    if (!owners || !Array.isArray(owners) || owners.length === 0) {
      return {
        code: 400,
        message: "Please provide a valid list of owner addresses.",
      };
    }

    // const invalidOwners = owners.filter((owner) => !isAddress(owner));
    // if (invalidOwners.length > 0) {
    //   return {
    //     code: 400,
    //     message: `The following addresses are invalid: ${invalidOwners.join(", ")}`,
    //   };
    // }

    if (
      typeof requiredConfirmations !== "number" ||
      requiredConfirmations <= 0 ||
      requiredConfirmations > owners.length
    ) {
      return {
        code: 400,
        message: `The "required" parameter must be a positive integer no greater than the number of owners.`,
      };
    }

    try {
      // Interact with the contract to create a multisig
      const tx = await contract.deployNewMultisig(
        owners,
        requiredConfirmations
      );
      const receipt = await tx.wait();

      const multisigAddress = receipt.events?.find(
        (event: any) => event.event === "MultisigCreated"
      )?.args?.multisigAddress;

      if (!multisigAddress) {
        return {
          code: 500,
          message:
            "Failed to retrieve the multisig address. Please try again later.",
        };
      }

      return {
        code: 200,
        message: `Multisig wallet created successfully! Address: ${multisigAddress}`,
      };
    } catch (error) {
      console.error("Error creating multisig:", error);
      return {
        code: 500,
        message:
          "Failed to create multisig. Please check your inputs and try again.",
      };
    }
  } else {
    return { code: 400, message: "Skill not found." };
  }
}
// try {
//   console.log("Incoming message", context.message);
// Extract command details
// const [ownersRaw, requiredConfirmationsRaw] = args;
// const owners = ownersRaw
//   .split(",")
//   .map((address: string) => address.trim());
// const requiredConfirmations = parseInt(requiredConfirmationsRaw, 10);

//   const { owners, requiredConfirmations } = args;
//   const ownerAddresses = owners.split(",").map((addr: string) => addr.trim());
//   const confirmations = parseInt(requiredConfirmations, 10);

//   // Validate input
//   if (!Array.isArray(owners) || owners.length === 0) {
//     return "Error: You must provide at least one owner address.";
//   }
//   if (
//     isNaN(requiredConfirmations) ||
//     requiredConfirmations <= 0 ||
//     requiredConfirmations > owners.length
//   ) {
//     return `Error: Invalid number of required confirmations. Must be between 1 and ${owners.length}.`;
//   }

//   // Connect to the factory contract
//   const provider = new ethers.providers.JsonRpcProvider(
//     "https://rpc.sepolia.mantle.xyz"
//   );
//   const signer = new ethers.Wallet(
//     "a1fd1aaafec01bd86ea80ccbe856168b2ecdd7ead53c764ac6e1f7ff4864452e",
//     provider
//   ); // Replace with the bot's private key
//   const factoryContract = new ethers.Contract(
//     FACTORY_ADDRESS,
//     FACTORY_ABI,
//     signer
//   );

//   // Deploy the new multisig
//   const tx = await factoryContract.deployNewMultisig(
//     owners,
//     requiredConfirmations
//   );
//   await tx.wait(); // Wait for the transaction to be mined

//   const receipt = await provider.getTransactionReceipt(tx.hash);
//   const multisigAddress = receipt.logs[0]?.address;

//   // Respond with the deployed multisig address
//   return `Multisig wallet successfully created at address: ${multisigAddress}`;
//   } catch (error: any) {
//     console.error("Error handling multisig creation:", error);
//     return `Error: Unable to create the multisig wallet. ${error.message}`;
//  }
