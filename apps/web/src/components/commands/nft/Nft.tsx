import { DataPill } from "../../DataPill";
import { useQuery } from "react-query";
import Image from "next/image";
import { NftPortAPIAssetResponse, NftPortAPIStatsResponse } from "./types";

export type NftWidgetProps = {
  property: "holders" | "floor" | "total-sales-volume" | "image";
  address: string;
  chain: number;
  tokenId?: number;
};

export const NftWidget = ({ property, ...props }: NftWidgetProps) => {
  switch (property) {
    case "floor":
      return <NftFloorWidget {...props} />;
    case "holders":
      return null;
    case "total-sales-volume":
      return <NftTotalSalesVolumeWidget {...props} />;
    case "image":
      return <NftImageWidget {...props} />;
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
    const url = `https://api.nftport.xyz/v0/transactions/stats/${address}?chain=${NFT_PORT_CHAINS[chain]}`;
    const response = await fetch(url, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_NFT_PORT_API_KEY as string,
      },
    });
    console.log("response", response)
    if (!response.ok) {
      throw new Error(`NFT Port API error. Status: ${response.status} ${response.statusText}`);
    }
    const json: NftPortAPIStatsResponse = await response.json();

    return {
      floorPrice: json.statistics.floor_price as number,
    };
  });

  return <DataPill query={query}>{`${query.data?.floorPrice} ETH`}</DataPill>;
};

const NftTotalSalesVolumeWidget = ({
  address,
  chain,
}: Pick<NftWidgetProps, "address" | "chain">) => {
  const query = useQuery(["NFT", "VOLUME", address, chain], async () => {
    const response = await fetch(
      `https://api.nftport.xyz/v0/transactions/stats/${address}?chain=${NFT_PORT_CHAINS[chain]}`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_NFT_PORT_API_KEY as string,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`NFT Port API error. Status: ${response.status} ${response.statusText}`);
    }

    const json: NftPortAPIStatsResponse = await response.json();

    return {
      totalSalesVolume: json.statistics.total_volume as number,
    };
  });

  return (
    <DataPill query={query}>{`${query.data?.totalSalesVolume} ETH`}</DataPill>
  );
};

const NftImageWidget = ({
  address,
  chain,
  tokenId,
}: Pick<NftWidgetProps, "address" | "chain" | "tokenId">) => {
  const query = useQuery(["NFT", "IMAGE", address, chain], async () => {
    const url = `https://api.nftport.xyz/v0/nfts/${address}/${tokenId}?chain=${NFT_PORT_CHAINS[chain]}`;
    const response = await fetch(url, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_NFT_PORT_API_KEY as string,
      },
    });
    if (!response.ok) {
      throw new Error(`NFT Port API error. Status: ${response.status} ${response.statusText}`);
    }

    const json: NftPortAPIAssetResponse = await response.json();
    return {
      image: json.nft.cached_file_url as string,
      collectionName: json.contract.name as string,
    };
  });
  if (!query.data) return null;
  return (
    <Image
      src={query.data.image}
      alt={query.data.collectionName}
      width={100}
      height={100}
      style={{ margin: 0 }}
    />
  );
};
