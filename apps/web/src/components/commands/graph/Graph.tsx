import request from "graphql-request";
import get from "lodash.get";
import { useQuery } from "react-query";
import { hash } from "../../../utils/hash";
import { DataPill } from "../../DataPill";

type GraphWidgetProps = {
  url: string;
  query: string;
  path: string;
};

export const GraphWidget = ({ url, query, path }: GraphWidgetProps) => {
  const graphQuery = useQuery(["GRAPH", hash(query), path], async () => {
    const result = await request(url, query);
    return get(result, path);
  });

  return (
    <DataPill query={graphQuery} className="bg-indigo-100">
      {graphQuery.data}
    </DataPill>
  );
};
