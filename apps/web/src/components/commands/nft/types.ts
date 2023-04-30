// Path: https://api.simplehash.com/api/v0/nfts/collections/{chain}/{contract_address}

export type SimpleHashCollectionResponse = {
  next_cursor: string;
  next: string;
  previous: string;
  collections: Collection[];
};

type Collection = {
  collection_id: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  external_url: string;
  twitter_username: string;
  discord_url: string;
  marketplace_pages: MarketplacePage[];
  metaplex_mint: string;
  metaplex_first_verified_creator: string;
  floor_prices: FloorPrice[];
  distinct_owner_count: number;
  distinct_nft_count: number;
  total_quantity: number;
  top_contracts: string[];
};

type MarketplacePage = {
  marketplace_id: string;
  marketplace_name: string;
  marketplace_collection_id: string;
  collection_url: string;
  verified: boolean;
};

type FloorPrice = {
  marketplace_id: string;
  marketplace_name: string;
  value: number;
  payment_token: PaymentToken;
};

type PaymentToken = {
  payment_token_id: string;
  symbol: string;
  name: string;
  decimals: number;
  address: string;
};

export type SimpleHashCollectionActivityResponse = {
  collections: CollectionActivity[];
};

type CollectionActivity = {
  collection_id: string;
  name: string;
  _1_day_volume: number;
  _1_day_prior_volume: number;
  _1_day_volume_change_percent: number;
  _7_day_volume: number;
  _30_day_volume: number;
  _90_day_volume: number;
  all_time_volume: string;
  market_cap: number;
  payment_token: PaymentToken;
};

export type SimpleHashNFTDetailsResponse = {
  nft_id: string;
  chain: string;
  contract_address: string;
  token_id: string;
  name: string;
  description: string;
  previews: Previews;
  image_url: string;
  image_properties: ImageProperties;
  video_url: string;
  video_properties: string;
  audio_url: string;
  audio_properties: string;
  model_url: string;
  model_properties: string;
  background_color: string;
  external_url: string;
  created_date: string;
  status: string;
  token_count: number;
  owner_count: number;
  owners: Owner[];
  contract: Contract;
  collection: Collection;
  marketplace_pages: MarketplacePage[];
  floor_prices: FloorPrice[];
  last_sale: LastSale;
  first_created: FirstCreated;
  rarity: Rarity;
  royalty: any[];
  extra_metadata: ExtraMetadata;
  attributes: Attribute[];
};

type Previews = {
  image_small_url: string;
  image_medium_url: string;
  image_large_url: string;
  image_opengraph_url: string;
  blurhash: string;
  predominant_color: string;
};

type ImageProperties = {
  width: number;
  height: number;
  size: number;
  mime_type: string;
};

type Owner = {
  owner_address: string;
  quantity: number;
  first_acquired_date: string;
  last_acquired_date: string;
};

type Contract = {
  type: string;
  name: string;
  symbol: string;
  deployed_by: string;
  deployed_via_contract: string;
};

type LastSale = {
  from_address: string;
  to_address: string;
  quantity: number;
  timestamp: string;
  transaction: string;
  marketplace_id: string;
  marketplace_name: string;
  is_bundle_sale: boolean;
  payment_token: PaymentToken;
};

type FirstCreated = {
  minted_to: string;
  quantity: number;
  timestamp: string;
  block_number: number;
  transaction: string;
  transaction_initiator: string;
};

type Rarity = {
  rank: number;
  score: number;
  unique_attributes: number;
};

type ExtraMetadata = Record<string, unknown>;

type Attribute = {
  trait_type: string;
  value: string;
  display_type: string;
  image_original_url: string;
  animation_original_url: string;
  metadata_original_url: string;
};

