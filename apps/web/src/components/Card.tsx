import { formatEthAddress } from "../utils/index";
import { timeConverter } from "../utils/index";
import TimeAgo from "react-timeago";
import { useEnsName } from "wagmi";
import Blockies from "react-blockies";
import { useRouter } from "next/router";

type CardProps = {
  id: number;
  title: string;
  timeStamp: number;
  author: string;
};

export const Card = (props: CardProps) => {
  const router = useRouter();

  const { data, isError, isLoading } = useEnsName({
    address: props.author,
  });

  const handleNavigation = (e) => {
    e.preventDefault();
    router.push(`/document/${props.id}`);
  };

  return (
    <div
      key={props.id}
      onClick={handleNavigation}
      className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow"
    >
      <div className="flex flex-col items-start	pl-5 pt-3 pb-5">
        <h5 className="mb-1 text-xl font-medium">{props.title}</h5>

        <p className="text-gray-400">
          {" "}
          <TimeAgo date={timeConverter(props.timeStamp)} />
        </p>
      </div>
      {!isLoading && !isError && (
        <div className="flex pb-5 pl-5">
          <Blockies
            seed={props.author}
            size={8}
            scale={3}
            className="rounded-xl"
          />
          <p className="items-center pb-5 pl-2">
            {data ? data : formatEthAddress(props.author, 5, 36)}
          </p>
        </div>
      )}
    </div>
  );
};
