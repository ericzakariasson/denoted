import { formatEthAddress } from "../utils/index";
import TimeAgo from "react-timeago";
import { useEnsName } from "wagmi";
import Blockies from "react-blockies";
import Link from "next/link";
import { Note } from "../composedb/note";

type CardProps = {
  doc: Note;
};

export const Card = ({ doc }: CardProps) => {
  const address = doc.author.id.split(":")[4];
  const { data: ensName } = useEnsName({
    address,
  });

  console.log(doc.createdAt);

  console.log(new Date(doc.createdAt));

  return (
    <Link href={`/${doc.id}`}>
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-700 bg-white p-5">
        <div className="flex flex-col items-start">
          <p className="mb-1 text-lg font-medium">{doc.title}</p>
          <p className="text-gray-400">
            <TimeAgo date={new Date(doc.createdAt)} />
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
