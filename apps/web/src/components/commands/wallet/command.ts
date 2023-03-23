import { CommandGroup } from "../../CommandList";

import { balanceCommand } from "../balance/command";

export const walletCommand: CommandGroup = {
  type: "group",
  name: "Wallet",
  items: [balanceCommand],
};
