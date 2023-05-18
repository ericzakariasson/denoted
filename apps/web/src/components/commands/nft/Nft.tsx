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
import { SUPPORTED_CHAINS } from "../../../supported-chains";

export type NftWidgetProps = {
  property: "holders" | "floor" | "total-sales-volume" | "image";
  address: string;
  chain: number | string;
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
      return <NftParentImageWidget {...props} />;
    default:
      return null;
  }
};

const NftFloorWidget = ({
  address,
  chain,
}: Pick<NftWidgetProps, "address" | "chain">) => {
  const query = useQuery(["NFT", "FLOOR", address, chain], async () => {
    const chainName = SUPPORTED_CHAINS.find(
      (c) => c.id === Number(chain)
    )?.name.toLowerCase();
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
  chain,
}: Pick<NftWidgetProps, "address" | "chain">) => {
  const query = useQuery(["NFT", "FLOOR", address, chain], async () => {
    const chainName = SUPPORTED_CHAINS.find(
      (c) => c.id === Number(chain)
    )?.name.toLowerCase();
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
      uniqueHolders: json.collections[0].distinct_owner_count,
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
  chain,
}: Pick<NftWidgetProps, "address" | "chain">) => {
  const query = useQuery(["NFT", "VOLUME", address, chain], async () => {
    const chainName = SUPPORTED_CHAINS.find(
      (c) => c.id === Number(chain)
    )?.name.toLowerCase();
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

const NftParentImageWidget = ({
  address,
  chain,
  tokenId,
}: Pick<NftWidgetProps, "address" | "chain" | "tokenId">) => {
  const query = useQuery(["NFT", "IMAGE", address, chain, tokenId], async () => {
    const chainName = SUPPORTED_CHAINS.find(
      (c) => c.id === Number(chain)
    )?.name.toLowerCase();
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
      id: json.token_id,
      image: json.image_url,
      collectionName: json.collection.name,
    };
  });
  if (!query.data) return null;
  return (
    <NftImageWidget data={query.data}
    />
  );
};

const NftImageWidget = ({ data }: {
  data: {
    id: string;
    image: string;
    collectionName: string;
  }
}) => {
  return (
    <Image
      key={data.id}
      src={data.image}
      alt={data.collectionName}
      width={100}
      height={100}
      style={{ margin: 0 }} />
  )
}
