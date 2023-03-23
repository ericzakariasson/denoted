import { CommandGroup } from "../../CommandList";

import { balanceCommand } from "../balance/command";
import { netWorthCommand } from "../net-worth/command";

export const walletCommand: CommandGroup = {
  type: "group",
  name: "Wallet",
  items: [balanceCommand, netWorthCommand],
};
