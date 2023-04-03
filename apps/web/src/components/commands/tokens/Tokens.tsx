import { DataPill } from "../../DataPill";
import { useQuery } from "react-query";

export type TokenWidgetProps = {
  property: "price";
  address: string;
  chain: number;
};

export const TokenWidget = ({ property, ...props }: TokenWidgetProps) => {
  switch (property) {
    case "price":
      return <TokenPriceWidget {...props} />;
    default:
      return null;
  }
};

const NFT_PORT_CHAINS: Record<number, string> = {
  1: "ethereum",
};

const TokenPriceWidget = ({
  address,
  chain,
}: Pick<TokenWidgetProps, "address" | "chain">) => {
  const query = useQuery(["TOKEN", "PRICE", address, chain], async () => {
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
