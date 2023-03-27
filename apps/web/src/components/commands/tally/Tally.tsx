import request from "graphql-request";
import get from "lodash.get";
import { useQuery } from "react-query";
import { hash } from "../../../utils/hash";
import { DataPill } from "../../DataPill";

export type TallyWidgetProps = {
  query: string;
  path: string;
};

const url = "https://api.tally.xyz/query";

const headers = {
  "Api-key": process.env.NEXT_PUBLIC_TALLY_KEY as string,
};

export const TallyWidget = ({ query, path }: TallyWidgetProps) => {
  const tallyQuery = useQuery(["TALLY", hash(query), path], async () => {
    const result = await request(url, query, undefined, headers);
    return get(result, path) as string;
  });

  return <DataPill query={tallyQuery}>{tallyQuery.data}</DataPill>;
};
