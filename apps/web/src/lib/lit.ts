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

function extractExpirationTimeAndConvertToDate(input: string) {
  const expirationTimeRegex =
    /Expiration Time: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/;
  const match = input.match(expirationTimeRegex);

  if (match && match[1]) {
    return new Date(match[1]);
  }

  return null;
}

export function getIsLitAuthenticated() {
  try {
    const values = [
      LOCAL_STORAGE_KEYS.AUTH_SIGNATURE,
      LOCAL_STORAGE_KEYS.KEY_PAIR,
    ].map((key) => {
      return localStorage.getItem(key);
    });

    if (!values.every((value) => Boolean(value))) {
      return false;
    }

    const authSignature = JSON.parse(values[0] ?? "");

    const expiresAt = extractExpirationTimeAndConvertToDate(
      authSignature.signedMessage
    );

    if (!expiresAt) {
      return false;
    }

    const isExpired = expiresAt.getTime() < new Date().getTime();

    if (isExpired) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_SIGNATURE);
      return false;
    }

    return true;
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

function daysInFuture(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export async function authenticateLit() {
  await litClient.connect();

  return await checkAndSignAuthMessage({
    chain: litChain,
    expiration: daysInFuture(7).toISOString()
  });
}

export async function storeEncryptionKey(
  symmetricEncryptionKey: CryptoKey,
  address: string
): Promise<{
  encryptedKey: string;
}> {
  await litClient.connect();

  const authSig = await authenticateLit();

  const exportedKey = new Uint8Array(await crypto.subtle.exportKey("raw", symmetricEncryptionKey));

  const encryptedKey = await litClient.saveEncryptionKey({
    accessControlConditions: [getAddressOwnerAcl(address)],
    symmetricKey: exportedKey,
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
