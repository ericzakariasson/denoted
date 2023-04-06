import Link from "next/link";
import { useEffect, useState } from "react";
import Blockies from "react-blockies";
import TimeAgo from "react-timeago";
import { useEnsName, useAccount } from "wagmi";
import { Page } from "../composedb/page";
import { decryptString } from "../lib/crypto";
import { formatEthAddress } from "../utils/index";
import { getStoredPageEncryptionKey } from "../utils/page-helper";

type CardProps = {
  page: Page;
};

function DecryptedText({ pageKey, value }: { pageKey: string; value: string }) {
  const [decrypted, setDecrypted] = useState<string | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    async function run() {
      const { key } = await getStoredPageEncryptionKey(pageKey, address!);
      const decryptedValue = await decryptString(value, key);
      setDecrypted(decryptedValue);
    }
    run();
  }, [address, pageKey, value]);

  return <span>{decrypted ?? "Loading..."}</span>;
}

export const Card = ({ page }: CardProps) => {
  const address = page.createdBy.id.split(":")[4];
  const { data: ensName } = useEnsName({
    address,
  });

  return (
    <Link href={`/${page.id}`}>
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-700 bg-white p-5">
        <div className="flex flex-col items-start">
          <p className="mb-1 text-lg font-medium">
            {page.key ? (
              <DecryptedText pageKey={page.key} value={page.title} />
            ) : (
              page.title
            )}
          </p>
          <p className="text-gray-400">
            <TimeAgo date={new Date(page.createdAt)} />
          </p>
        </div>
        <div className="flex gap-2">
          <Blockies
            seed={address}
            size={8}
            scale={3}
            className="rounded-full"
          />
          <p className="items-center">
            {ensName ?? formatEthAddress(address, 5, 36)}
          </p>
        </div>
      </div>
    </Link>
  );
};
