import { CommandGroup } from "../CommandList";
import { balanceCommand } from "./balance/command";
import { duneCommand } from "./dune/command";
import { graphCommand } from "./graph/command";
import { lensProfileCommand, lensPostCommand } from "./social/lens";
import { netWorthCommand } from "./net-worth/command";
import { nftFloorPriceCommand, nftImageCommand, nftTotalSalesVolumeCommand } from "./nft/command";
import { tallyCommand } from "./tally/command";
import { tokenPriceCommand } from "./tokens/command";
import { transactionCommand } from "./transaction/command";

export const COMMANDS: CommandGroup[] = [
  { name: "Wallet", items: [balanceCommand, netWorthCommand] },
  { name: "Social", items: [lensProfileCommand, lensPostCommand] },
  { name: "Other", items: [graphCommand, duneCommand, tallyCommand, transactionCommand] },
  { name: "NFT", items: [nftFloorPriceCommand, nftImageCommand, nftTotalSalesVolumeCommand] },
  { name: "Tokens", items: [tokenPriceCommand]}
];
