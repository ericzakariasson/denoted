import { CommandListItem } from "../CommandList";
import { balanceCommand } from "./balance/command";
import { duneCommand } from "./dune/command";
import { graphCommand } from "./graph/command";
import { lensCommand } from "./lens/command";
import { tallyCommand } from "./tally/command";
import { walletCommand } from "./wallet/command";

export const COMMANDS: CommandListItem<string>[] = [
  balanceCommand,
  lensCommand,
  graphCommand,
  duneCommand,
  tallyCommand,
  walletCommand,
];
