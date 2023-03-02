import { formatEthAddress } from "../utils/index";
import { timeConverter } from "../utils/index";
import TimeAgo from "react-timeago";
import { useEnsName } from "wagmi";
import Blockies from "react-blockies";
import Link from "next/link";
import { useEffect, useState } from "react";

type CardProps = {
  id: number;
  title: string;
  timeStamp: number;
  author: string;
};

export const Card = (props: CardProps) => {
  const [add, setAdd] = useState<string | undefined | null>(props.author);
  const { data: ensName } = useEnsName({
    address: props.author,
  });

  useEffect(() => {
    return setAdd(ensName);
  }, [ensName]);

  return (
    <Link href={`/${props.id}`}>
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-700 bg-white p-5">
        <div className="flex flex-col items-start">
          <p className="mb-1 text-lg font-medium">{props.title}</p>
          <p className="text-gray-400">
            <TimeAgo date={timeConverter(props.timeStamp)} />
          </p>
        </div>
        <div className="flex gap-2">
          <Blockies
            seed={props.author}
            size={8}
            scale={3}
            className="rounded-full"
          />
          <p className="items-center">
            {add ? add : formatEthAddress(props.author, 5, 36)}
          </p>
        </div>
      </div>
    </Link>
  );
};
