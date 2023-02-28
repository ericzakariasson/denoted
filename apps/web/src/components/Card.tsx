import { formatEthAddress } from "../utils/index";
import { timeConverter } from "../utils/index";
import TimeAgo from "react-timeago";
import { useEnsName } from "wagmi";

type CardProps = {
  title: string;
  timeStamp: number;
  author: string;
};

export const Card = (props: CardProps) => {
  const { data, isError, isLoading } = useEnsName({
    address: props.author,
  });

  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow">
      <div className="flex flex-col items-start	pl-5 pt-3 pb-5">
        <h5 className="mb-1 text-xl font-medium">{props.title}</h5>

        <p className="text-gray-400">
          {" "}
          <TimeAgo date={timeConverter(props.timeStamp)} />
        </p>
      </div>
      {!isLoading && !isError && (
        <div className="flex pb-5 pl-5">
          <img
            src="me.png"
            alt="Picture of the author"
            width={30}
            height={30}
          />
          <p className="pb-5 pl-5">
            {data ? data : formatEthAddress(props.author, 5, 36)}
          </p>
        </div>
      )}
    </div>
  );
};
