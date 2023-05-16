import { CommandGroup } from "../CommandList";
import { balanceCommand } from "./balance/command";
import { duneCommand } from "./dune/command";
import { graphCommand } from "./graph/command";
import { lensProfileCommand, lensPostCommand } from "./social/lens";
import { netWorthCommand } from "./net-worth/command";
import {
  nftFloorPriceCommand,
  nftImageCommand,
  nftTotalSalesVolumeCommand,
  nftUniqueHoldersCommand,
} from "./nft/command";
import { tallyCommand } from "./tally/command";
import { tokenPriceCommand } from "./tokens/command";
import { transactionCommand } from "./transaction/command";
import { bookmarkCommand } from "./bookmark/command";
import { tweetCommand } from "./twitter/command";

export const COMMANDS: CommandGroup[] = [
  { name: "Wallet", items: [balanceCommand, netWorthCommand] },
  { 
    name: "Social",
    items: [
      lensProfileCommand,
      lensPostCommand,
      tweetCommand,
    ]
  },
  {
    name: "Other",
    items: [
      graphCommand,
      duneCommand,
      tallyCommand,
      transactionCommand,
      bookmarkCommand,
    ],
  },
  {
    name: "NFT",
    items: [
      nftFloorPriceCommand,
      nftImageCommand,
      nftTotalSalesVolumeCommand,
      nftUniqueHoldersCommand,
    ],
  },
  { name: "Tokens", items: [tokenPriceCommand] },
];