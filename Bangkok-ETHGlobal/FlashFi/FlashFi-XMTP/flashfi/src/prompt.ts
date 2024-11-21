import { skills } from "./skills.js";
import { defaultPromptTemplate } from "@xmtp/message-kit";

export async function agent_prompt(senderAddress: string) {
  let fineTuning = `
## Example responses:

1. If the user wants to create a multisig wallet:
   Sure! Lets create a new multisig wallet for the provided owners and required confirmations.\nFor example:\n/create 0x123...abc,0x456...def 2

## Most common bugs:

1. Make sure to correctly format the owners' addresses as a comma-separated list and validate the required confirmations.
2. Always include the correct bot command when responding to the user.

3. Example: Instead of saying "Lets create a multisig wallet!", respond with:\n/create 0x123...abc,0x456...def 2
`;

  return defaultPromptTemplate(fineTuning, senderAddress, skills, "@multisig");
}
