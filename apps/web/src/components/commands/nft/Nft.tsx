import { DataPill } from "../../DataPill";
import { useQuery } from "react-query";
import Image from "next/image";
import {
  SimpleHashNFTDetailsResponse,
  SimpleHashCollectionActivityResponse,
  SimpleHashCollectionResponse,
} from "./types";
import { formatEther } from "../../../utils/format";
import { exponentialToDecimal } from "../../../utils/exponents";

export type NftWidgetProps = {
  property: "holders" | "floor" | "total-sales-volume" | "image";
  address: string;
  chainName: string;
  chainId: number;
  tokenId?: number;
};

export const NftWidget = ({ property, ...props }: NftWidgetProps) => {
  switch (property) {
    case "floor":
      return <NftFloorWidget {...props} />;
    case "holders":
      return <NftUniqueHoldersWidget {...props} />;
    case "total-sales-volume":
      return <NftTotalSalesVolumeWidget {...props} />;
    case "image":
      return <NftImageWidget {...props} />;
    default:
      return null;
  }
};

const NftFloorWidget = ({
  address,
  chainName,
}: Pick<NftWidgetProps, "address" | "chainName">) => {
  const query = useQuery(["NFT", "FLOOR", address, chainName], async () => {
    const url = `https://api.simplehash.com/api/v0/nfts/collections/${chainName}/${address}`;
    const response = await fetch(url, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_SIMPLEHASH_API_KEY as string,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `SimpleHash API error. Status: ${response.status} ${response.statusText}`
      );
    }
    const json: SimpleHashCollectionResponse = await response.json();
    if (json.collections.length === 0) {
      return null;
    }
    const rawFloorPrice = json.collections[0].floor_prices[0].value.toString();
    return {
      floorPrice: formatEther(rawFloorPrice),
    };
  });

  return (
    <DataPill query={query}>
      {query.data?.floorPrice !== undefined
        ? `${query.data.floorPrice} ETH`
        : "no data"}
    </DataPill>
  );
};

const NftUniqueHoldersWidget = ({
  address,
  chainName,
}: Pick<NftWidgetProps, "address" | "chainName">) => {
  const query = useQuery(["NFT", "FLOOR", address, chainName], async () => {
    const url = `https://api.simplehash.com/api/v0/nfts/collections/${chainName}/${address}`;
    const response = await fetch(url, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_SIMPLEHASH_API_KEY as string,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `SimpleHash API error. Status: ${response.status} ${response.statusText}`
      );
    }
    const json: SimpleHashCollectionResponse = await response.json();
    if (json.collections.length === 0) {
      return null;
    }
    return {
      uniqueHolders: json.collections[0].distinct_owner_count
    };
  });

  return (
    <DataPill query={query}>
      {query.data?.uniqueHolders !== undefined
        ? `${query.data.uniqueHolders} Holders`
        : "no data"}
    </DataPill>
  );
};

const NftTotalSalesVolumeWidget = ({
  address,
  chainName,
}: Pick<NftWidgetProps, "address" | "chainName">) => {
  const query = useQuery(["NFT", "VOLUME", address, chainName], async () => {
    const collectionUrl = `https://api.simplehash.com/api/v0/nfts/collections/${chainName}/${address}`;
    const response = await fetch(collectionUrl, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_SIMPLEHASH_API_KEY as string,
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: SimpleHashCollectionResponse) => {
        const collectionId = data.collections[0].collection_id;
        const collectionActivityUrl = `https://api.simplehash.com/api/v0/nfts/collections_activity?collection_ids=${collectionId}`;
        return fetch(collectionActivityUrl, {
          headers: {
            "X-API-KEY": process.env.NEXT_PUBLIC_SIMPLEHASH_API_KEY as string,
            accept: "application/json",
          },
        });
      });

    if (!response.ok) {
      throw new Error(
        `SimpleHash API error. Status: ${response.status} ${response.statusText}`
      );
    }
    const json: SimpleHashCollectionActivityResponse = await response.json();
    if (json.collections.length === 0) {
      return null;
    }
    // NOTE: The Simple Hash API only stretches back 90 days
    const rawNinetyDaysSalesVolume = json.collections[0].all_time_volume;
    const formattedNumber = exponentialToDecimal(
      Number(rawNinetyDaysSalesVolume)
    );
    return {
      ninetyDaysSalesVolume: formatEther(formattedNumber),
    };
  });

  return (
    <DataPill query={query}>
      {query.data?.ninetyDaysSalesVolume !== undefined
        ? `${query.data.ninetyDaysSalesVolume} ETH`
        : "no data"}
    </DataPill>
  );
};

const NftImageWidget = ({
  address,
  chainName,
  tokenId,
}: Pick<NftWidgetProps, "address" | "chainName" | "tokenId">) => {
  const query = useQuery(["NFT", "IMAGE", address, chainName], async () => {
    const url = `https://api.simplehash.com/api/v0/nfts/${chainName}/${address}/${tokenId}`;
    const response = await fetch(url, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_SIMPLEHASH_API_KEY as string,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `SimpleHash API error. Status: ${response.status} ${response.statusText}`
      );
    }
    const json: SimpleHashNFTDetailsResponse = await response.json();

    return {
      image: json.image_url,
      collectionName: json.collection.name,
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
