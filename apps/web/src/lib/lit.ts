import {
  checkAndSignAuthMessage,
  LitNodeClient,
  uint8arrayToString,
} from "@lit-protocol/lit-node-client";
import { AccsDefaultParams } from "@lit-protocol/types";

export const litClient = new LitNodeClient({
  debug: false,
});

export const litChain = "ethereum";

const LOCAL_STORAGE_KEYS = {
  AUTH_SIGNATURE: "lit-auth-signature",
  KEY_PAIR: "lit-comms-keypair",
};

export function getIsLitAuthenticated() {
  try {
    return [
      LOCAL_STORAGE_KEYS.AUTH_SIGNATURE,
      LOCAL_STORAGE_KEYS.KEY_PAIR,
    ].every((key) => {
      return Boolean(localStorage.getItem(key));
    });
  } catch {
    return false;
  }
}

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

export async function authenticateLit() {
  await litClient.connect();

  return await checkAndSignAuthMessage({
    chain: litChain,
  });
}

export async function storeEncryptionKey(
  symmetricEncryptionKey: Uint8Array,
  address: string
): Promise<{
  encryptedKey: string;
}> {
  await litClient.connect();

  const authSig = await authenticateLit();

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

  const authSig = await authenticateLit();

  const encryptionKey = await litClient.getEncryptionKey({
    accessControlConditions: [getAddressOwnerAcl(userAddress)],
    toDecrypt: encryptedSymmetricKey,
    chain: litChain,
    authSig,
  });

  return { encryptionKey };
}
