import Link from "next/link";
import { useQuery } from "react-query";
import { lensClient } from "../../../lib/lens";
import { DataPill } from "../../DataPill";

type LensWidgetProps = {
  handle: string;
};

export const LensWidget = ({ handle }: LensWidgetProps) => {
  const query = useQuery(["LENS", "PROFILE", handle], async () => {
    return lensClient.profile.fetch({ handle });
  });

  return (
    <DataPill query={query} className="bg-green-100">
      <Link
        href={`https://lenster.xyz/u/${handle.replace(".lens", "")}`}
        className="no-underline"
        target="_blank"
      >
        🌿
      </Link>{" "}
      {query.data?.name ?? handle}
    </DataPill>
  );
};
