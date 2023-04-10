import { Avatar } from "connectkit";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { Address, useEnsName } from "wagmi";
import { Page } from "../composedb/page";
import { formatEthAddress } from "../utils/index";
import { DecryptedText } from "./DecryptedText";

type CardProps = {
  page: Page;
};

export const Card = ({ page }: CardProps) => {
  const address = page.createdBy.id.split(":")[4] as Address;
  const { data: ensName } = useEnsName({
    address,
  });

  return (
    <Link href={`/${page.id}`}>
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-gray-50 px-5 py-4">
        <div className="flex flex-col items-start">
          <p className="mb-1 text-lg font-medium">
            {page.key ? (
              <DecryptedText encryptionKey={page.key} value={page.title} />
            ) : (
              page.title
            )}
          </p>
          <p className="text-gray-400">
            <TimeAgo date={new Date(page.createdAt)} />
          </p>
        </div>
        <div className="flex gap-2">
          <Avatar address={address} size={24} />
          <p className="items-center">
            {ensName ?? formatEthAddress(address, 5, 36)}
          </p>
        </div>
      </div>
    </Link>
  );
};
