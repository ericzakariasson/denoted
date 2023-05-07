const ENCRYPTION_ALGORITHM: AesKeyGenParams = {
  name: "AES-CBC",
  length: 256,
};

const KEY_USAGE: readonly KeyUsage[] = ["encrypt", "decrypt"];

export async function generateEncryptionKey() : Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    ENCRYPTION_ALGORITHM,
    true,
    KEY_USAGE
  );
}

export async function importEncryptionKey(symmetricKey: Uint8Array) {
  const key = await crypto.subtle.importKey(
    "raw",
    symmetricKey,
    ENCRYPTION_ALGORITHM,
    true,
    KEY_USAGE
  );

  return { key };
}

function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  return Buffer.from(
    String.fromCharCode(...new Uint8Array(arrayBuffer))
  ).toString("base64");
}

function base64ToUint8Array(base64: string) {
  return new Uint8Array(
    Buffer.from(base64, "base64")
      .toString()
      .split("")
      .map((char) => char.charCodeAt(0))
  );
}

type EncryptedValue = {
  iv: string;
  encrypted: string;
};

export async function encrypt(
  buf: BufferSource,
  symmetricKey: CryptoKey
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    symmetricKey,
    buf
  );

  const data: EncryptedValue = {
    iv: arrayBufferToBase64(iv),
    encrypted: arrayBufferToBase64(encrypted),
  };

  return JSON.stringify(data);
}

export async function encryptString<T extends string>(
  str: T,
  symmetricKey: CryptoKey
): Promise<string> {
  const encodedString = new TextEncoder().encode(str);
  return encrypt(encodedString, symmetricKey);
}

export async function decrypt(
  encryptedStr: string,
  key: CryptoKey
): Promise<ArrayBuffer> {
  const { iv, encrypted } = JSON.parse(encryptedStr) as EncryptedValue;

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: base64ToUint8Array(iv),
    },
    key,
    base64ToUint8Array(encrypted)
  );

  return decrypted;
}

export async function decryptString<T extends string>(
  encryptedStr: string,
  key: CryptoKey
): Promise<T> {
  const decrypted = await decrypt(encryptedStr, key);

  const str = new TextDecoder().decode(decrypted);

  return str as T;
}
