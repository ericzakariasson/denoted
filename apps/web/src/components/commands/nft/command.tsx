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
