import { CommandGroup } from "../CommandList";
import { balanceCommand } from "./balance/command";
import { duneCommand } from "./dune/command";
import { graphCommand } from "./graph/command";
import { lensCommand } from "./lens/command";
import { netWorthCommand } from "./net-worth/command";
import { nftFloorPriceCommand } from "./nft/command";
import { tallyCommand } from "./tally/command";
import { tokenPriceCommand } from "./tokens/command";

export const COMMANDS: CommandGroup[] = [
  { name: "Wallet", items: [balanceCommand, netWorthCommand] },
  { name: "Social", items: [lensCommand] },
  { name: "Other", items: [graphCommand, duneCommand, tallyCommand] },
  { name: "NFT", items: [nftFloorPriceCommand] },
  { name: "Tokens", items: [tokenPriceCommand]}
];
