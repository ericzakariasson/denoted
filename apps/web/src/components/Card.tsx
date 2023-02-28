import { formatEthAddress } from "../utils/index";
import { timeConverter } from "../utils/index";
import TimeAgo from "react-timeago";
import { useEnsName } from "wagmi";
import Blockies from "react-blockies";
import Link from "next/link";

type CardProps = {
  id: number;
  title: string;
  timeStamp: number;
  author: string;
};

export const Card = (props: CardProps) => {
  const {
    data: ensName,
    isError,
    isLoading,
  } = useEnsName({
    address: props.author,
  });

  if (isLoading) {
    return null;
  }

  if (isError) {
    return null;
  }

  return (
    <Link href={`/${props.id}`}>
      <div
        key={props.id}
        className="w-full max-w-sm cursor-pointer rounded-xl border border-gray-200 bg-white shadow"
      >
        <div className="flex flex-col items-start	pl-5 pt-3 pb-5">
          <p className="mb-1 text-xl font-medium">{props.title}</p>
          <p className="text-gray-400">
            {" "}
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
          <p className="items-center pb-5 pl-2">
            {ensName ? ensName : formatEthAddress(props.author, 5, 36)}
          </p>
        </div>
      </div>
    </Link>
  );
};
