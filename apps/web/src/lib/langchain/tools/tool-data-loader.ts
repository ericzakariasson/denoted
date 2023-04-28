import { SUPPORTED_CHAINS } from "../../../supported-chains";

const NFT_PORT_CHAINS: Record<number, string> = {
  1: "ethereum",
};

export async function getNftFloorPrice({
  address,
  chainId,
}: {
  address: string;
  chainId: number;
}): Promise<string> {
  const chain = chainId;
  const url = `https://api.nftport.xyz/v0/transactions/stats/${address}?chain=${NFT_PORT_CHAINS[chain]}`;
  const response = await fetch(url, {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_NFT_PORT_API_KEY as string,
    },
  });

  if (response.status === 404) {
    return "No results";
  }

  const json: any = await response.json();

  if (json.response === "NOK") {
    return json?.error?.message;
  }

  if (!response.ok) {
    return `NFT Port API error. Status: ${response.status} ${response.statusText}`;
  }

  return `${json.statistics.floor_price} ETH on chain id ${chainId}`;
}

export async function searchNftCollection({
  query,
  chainId,
}: {
  query: string;
  chainId: number;
}): Promise<string> {
  const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId);
  const result = await fetch(
    `https://api.nftport.xyz/v0/search/contracts?text=${encodeURIComponent(
      query
    )}&chain=${chain?.name.toLowerCase()}&page_size=1`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_NFT_PORT_API_KEY as string,
      },
    }
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  return `Address ${result.search_results.at(0).contract_address} on chain id ${
    chain?.id
  }`;
}

export const TOOL_DATA_LOADER: Record<string, (args: any) => Promise<string>> =
  {
    "floor-price": getNftFloorPrice,
    "nft-collection-search": searchNftCollection,
  };
