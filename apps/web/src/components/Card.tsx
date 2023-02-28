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
      <div className="mb-4 w-full px-2 sm:w-1/2 lg:w-1/3">
        <div className="w-full max-w-sm cursor-pointer rounded-xl border border-gray-200 bg-white shadow">
          <div className="flex flex-col items-start	pl-5 pt-3 pb-5">
            <p className="mb-1 text-xl font-medium">{props.title}</p>
            <p className="text-gray-400">
              <TimeAgo date={timeConverter(props.timeStamp)} />
            </p>
          </div>
          <div className="flex pb-5 pl-5">
            <Blockies
              seed={props.author}
              size={8}
              scale={3}
              className="rounded-xl"
            />
            <p className="items-center pb-3 pl-2">
              {add ? add : formatEthAddress(props.author, 5, 36)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
