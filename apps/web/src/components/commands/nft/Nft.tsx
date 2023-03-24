import { DataPill } from "../../DataPill";
import { useQuery } from "react-query";

export type NftWidgetProps = {
  property: "holders" | "floor";
  address: string;
  chain: number;
};

export const NftWidget = ({ property, ...props }: NftWidgetProps) => {
  switch (property) {
    case "floor":
      return <NftFloorWidget {...props} />;
    case "holders":
      return null;
    default:
      return null;
  }
};

const NFT_PORT_CHAINS: Record<number, string> = {
  1: "ethereum",
};

const NftFloorWidget = ({
  address,
  chain,
}: Pick<NftWidgetProps, "address" | "chain">) => {
  const query = useQuery(["NFT", "FLOOR", address, chain], async () => {
    const response = await fetch(
      `https://api.nftport.xyz/v0/transactions/stats/${address}?chain=${NFT_PORT_CHAINS[chain]}`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_NFT_PORT_API_KEY as string,
        },
      }
    );
    const json = await response.json();

    return {
      floorPrice: json.statistics.floor_price as number,
    };
  });

  return <DataPill query={query}>{query.data?.floorPrice}</DataPill>;
};
