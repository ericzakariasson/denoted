import { CommandItem } from "../CommandList";
import { balanceCommand } from "./balance/command";
import { duneCommand } from "./dune/command";
import { graphCommand } from "./graph/command";
import { lensCommand } from "./lens/command";
import { tallyCommand } from "./tally/command";

export const COMMANDS: CommandItem[] = [
  balanceCommand,
  lensCommand,
  graphCommand,
  duneCommand,
  tallyCommand,
];
