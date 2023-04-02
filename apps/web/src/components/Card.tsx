import Link from "next/link";
import Blockies from "react-blockies";
import TimeAgo from "react-timeago";
import { useEnsName } from "wagmi";
import { Page } from "../composedb/page";
import { formatEthAddress } from "../utils/index";

type CardProps = {
  page: Page;
};

export const Card = ({ page }: CardProps) => {
  const address = page.createdBy.id.split(":")[4];
  const { data: ensName } = useEnsName({
    address,
  });

  return (
    <Link href={`/${page.id}`}>
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-700 bg-white p-5">
        <div className="flex flex-col items-start">
          <p className="mb-1 text-lg font-medium">{page.title}</p>
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
