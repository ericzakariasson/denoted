import {
  checkAndSignAuthMessage,
  decryptString,
  encryptString,
  LitNodeClient,
  uint8arrayToString,
} from "@lit-protocol/lit-node-client";
import { AccsDefaultParams } from "@lit-protocol/types";

export const litClient = new LitNodeClient({
  debug: false,
});

export const litChain = "ethereum";

export function getAddressOwnerAcl(address: string): AccsDefaultParams {
  return {
    contractAddress: "",
    standardContractType: "",
    chain: litChain,
    method: "",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: "=",
      value: address,
    },
  };
}

export async function storeEncryptionKey(
  symmetricEncryptionKey: Uint8Array,
  address: string
): Promise<{
  encryptedKey: string;
}> {
  await litClient.connect();

  const authSig = await checkAndSignAuthMessage({
    chain: litChain,
  });

  const encryptedKey = await litClient.saveEncryptionKey({
    accessControlConditions: [getAddressOwnerAcl(address)],
    symmetricKey: symmetricEncryptionKey,
    authSig,
    chain: litChain,
  });

  return {
    encryptedKey: uint8arrayToString(encryptedKey, "base16"),
  };
}

export async function getStoredEncryptionKey(
  encryptedSymmetricKey: string,
  userAddress: string
) {
  await litClient.connect();

  const authSig = await checkAndSignAuthMessage({
    chain: litChain,
  });

  const encryptionKey = await litClient.getEncryptionKey({
    accessControlConditions: [getAddressOwnerAcl(userAddress)],
    toDecrypt: encryptedSymmetricKey,
    chain: litChain,
    authSig,
  });

  return { encryptionKey };
}
