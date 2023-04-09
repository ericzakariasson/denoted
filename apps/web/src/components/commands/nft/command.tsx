import { mainnet } from "wagmi/chains";
import { CommandConfiguration } from "../types";
import { NftConfig } from "./Config";
import { NftWidgetProps } from "./Nft";

export const nftFloorPriceCommand: CommandConfiguration<NftWidgetProps> = {
  command: "floor-price",
  title: "Floor price",
  description: "Floor price for NFT",
  icon: null,
  blockType: "inline",
  defaultValues: {
    property: "floor",
    address: undefined,
    chain: mainnet.id,
  },
  ConfigComponent: NftConfig,
};

export const nftTotalSalesVolumeCommand: CommandConfiguration<NftWidgetProps> = {
  command: "total-sales-volume",
  title: "Total Sales Volume",
  description: "Total sales volume in ETH",
  icon: null,
  blockType: "inline",
  defaultValues: {
    property: "total-sales-volume",
    address: undefined,
    chain: mainnet.id,
  },
  ConfigComponent: NftConfig,
};

// export const nftHoldersCommand: CommandConfiguration<NftWidgetProps> = {
//   command: "holders",
//   title: "NFT Holders",
//   description: "Amount of Holders for NFT",
//   icon: null,
//   blockType: "inline",
//   defaultValues: {
//     property: "holders",
//     address: undefined,
//     chain: mainnet.id,
//   },
//   ConfigComponent: NftConfig,
// };

export const nftImageCommand: CommandConfiguration<NftWidgetProps> = {
  command: "nft-image",
  title: "NFT Image",
  description: "Image for NFT",
  icon: null,
  blockType: "inline",
  defaultValues: {
    property: "image",
    address: undefined,
    chain: mainnet.id,
    tokenId: undefined
  },
  ConfigComponent: NftConfig,
};
