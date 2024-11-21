import { handleMultisig } from "./handler/sig.js";
import type { SkillGroup } from "@xmtp/message-kit";

export const skills: SkillGroup[] = [
  {
    name: "Multisig Bot",
    tag: "@multisig",
    description: "Create and manage DAO multisig wallets.",
    skills: [
      {
        skill: "/create [owners] [requiredConfirmations]",
        handler : handleMultisig,
        description:
          "Create a new multisig wallet. Specify the owners' addresses and the number of required confirmations.",
        examples: [
          "/create owners=0x123...abc,0x456...def requiredConfirmations=2",
        ],
        params: {
          owners: {
            type: "string", // Comma-separated list of addresses
          },
          requiredConfirmations: {
            type: "number",
          },
        },
      },
    ],
  },
];
