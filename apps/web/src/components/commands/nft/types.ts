// Path: https://api.nftport.xyz/v0/transactions/stats/{contract_address}
export interface NftPortAPIStatsResponse {
  response: "OK" | "NOK";
  statistics: {
    one_day_volume: number;
    one_day_change: number;
    one_day_sales: number;
    one_day_average_price: number;
    seven_day_volume: number;
    seven_day_change: number;
    seven_day_sales: number;
    seven_day_average_price: number;
    thirty_day_volume: number;
    thirty_day_change: number;
    thirty_day_sales: number;
    thirty_day_average_price: number;
    total_volume: number;
    total_sales: number;
    total_supply: number;
    total_minted: number;
    num_owners: number;
    average_price: number;
    market_cap: number;
    floor_price: number;
    floor_price_historic_one_day: number;
    floor_price_historic_seven_day: number;
    floor_price_historic_thirty_day: number;
    updated_date: string;
  };
}

// Path: https://api.nftport.xyz/v0/nfts/{contract_address}/{token_id}
export interface NftPortAPIAssetResponse {
  response: "OK" | "NOK";
  nft: {
    chain: "ethereum" | "polygon" | "goerli";
    contract_address: string;
    token_id: string;
    metadata_url: string;
    metadata: {};
    file_information: {
      height: number;
      width: number;
      file_size: number;
    };
    file_url: string;
    animation_url: string;
    cached_file_url: string;
    cached_animation_url: string;
    creator_address: string;
    mint_date: string;
    updated_date: string;
    rarity: {
      strategy: string;
      score: number;
      rank: number;
      collection_size: number;
      updated_date: string;
      attributes: Attribute[];
    };
  };
  owner: string;
  contract: {
    name: string;
    symbol: string;
    type: "ERC721" | "ERC1155" | "CRYPTO_PUNKS";
    metadata: {
      description: string;
      thumbnail_url: string;
      cached_thumbnail_url: string;
      banner_url: string;
      cached_banner_url: string;
      status: "ADDED" | "PROCESSING" | "PENDING" | "REFRESHED_RECENTLY";
      status_message: string;
    };
  };
}

interface Attribute {
  trait_type: string;
  display_type?: string;
  value: string;
  statistics: {
    total_count: number;
    prevalence: number;
  };
}
