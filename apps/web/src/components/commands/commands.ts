import { CommandGroup, CommandItem } from "../CommandList";
import { duneCommand } from "./dune/command";
import { graphCommand } from "./graph/command";
import { lensCommand } from "./lens/command";
import { tallyCommand } from "./tally/command";
import { walletCommand } from "./wallet/command";

export const COMMANDS: (CommandGroup | CommandItem)[] = [
  lensCommand,
  graphCommand,
  duneCommand,
  tallyCommand,
  walletCommand,
];
