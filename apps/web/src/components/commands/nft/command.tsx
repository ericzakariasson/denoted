import { insertComponent } from "../../../lib/tiptap/tiptap";
import { CommandItem } from "../../CommandList";

export const nftFloorPriceCommand: CommandItem = {
  command: "floor-price",
  title: "NFT Floor price",
  description: "Floor price for NFT",
  icon: null,
  onCommand: insertComponent(
    '<nft-component property="floor"></nft-component>'
  ),
};

// export const nftHoldersCommand: CommandItem = {
//   command: "holders",
//   title: "NFT Holders",
//   description: "Amount of holders for NFT",
//   icon: null,
//   onCommand: insertComponent(
//     '<nft-component property="holders"></nft-component>'
//   ),
// };
