import { CommandGroup, CommandItem } from "../CommandList";
import { duneCommand } from "./dune/command";
import { graphCommand } from "./graph/command";
import { lensCommand } from "./lens/command";
import { tallyCommand } from "./tally/command";
import { balanceCommand } from "./balance/command";
import { netWorthCommand } from "./net-worth/command";

export const COMMANDS: CommandGroup[] = [
  { name: "Wallet", items: [balanceCommand, netWorthCommand] },
  { name: "Social", items: [lensCommand] },
  { name: "Other", items: [graphCommand, duneCommand, tallyCommand] },
];
