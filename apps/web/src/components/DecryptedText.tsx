import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { decryptString } from "../lib/crypto";
import { importStoredEncryptionKey } from "../utils/page-helper";

export function DecryptedText({
  encryptionKey,
  value,
}: {
  encryptionKey: string;
  value: string;
}) {
  const [decrypted, setDecrypted] = useState<string | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    async function run() {
      const { key } = await importStoredEncryptionKey(encryptionKey, address!);
      const decryptedValue = await decryptString(value, key);
      setDecrypted(decryptedValue);
    }
    run();
  }, [address, encryptionKey, value]);

  return <span>{decrypted ?? "Loading..."}</span>;
}
