import Link from "next/link";
import { useQuery } from "react-query";
import { lensClient } from "../../lib/lens";

type LensWidgetProps = {
  handle: string;
};

export const LensWidget = ({ handle }: LensWidgetProps) => {
  const { isLoading, data, isError } = useQuery(
    ["LENS", "PROFILE", handle],
    async () => {
      return lensClient.profile.fetch({ handle });
    }
  );

  if (isLoading) {
    return <span>loading...</span>;
  }

  if (isError) {
    return <span>an error has occured...</span>;
  }

  return (
    <span className="rounded-full bg-green-100 px-1 py-0">
      <Link
        href={`https://lenster.xyz/u/${handle.replace(".lens", "")}`}
        className="no-underline"
        target="_blank"
      >
        🌿
      </Link>{" "}
      {data?.name}: {data?.stats.totalPosts} posts, {data?.stats.totalFollowing}{" "}
      following & {data?.stats.totalFollowers} followers
    </span>
  );
};
