import request from "graphql-request";
import get from "lodash.get";
import { useQuery } from "react-query";
import { hash } from "../../../utils/hash";

type TallyWidgetProps = {
  query: string;
  path: string;
};

const url = "https://api.tally.xyz/query";

const headers = {
  "Api-key": process.env.NEXT_PUBLIC_TALLY_KEY as string,
};

export const TallyWidget = ({ query, path }: TallyWidgetProps) => {
  const { isLoading, data, isError } = useQuery(
    ["TALLY", hash(query), path],
    async () => {
      const result = await request(url, query, undefined, headers);
      return get(result, path) as string;
    }
  );
  if (isLoading) {
    return <span>loading...</span>;
  }

  if (isError) {
    return <span>an error has occured...</span>;
  }

  return <span className="rounded-full bg-indigo-300 px-1 py-0">{data}</span>;
};
