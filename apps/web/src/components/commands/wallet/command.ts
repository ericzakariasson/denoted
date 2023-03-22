import { insertComponent } from "../../../lib/tiptap/tiptap";
import { CommandListItem } from "../../CommandList";

import { balanceCommand } from "../balance/command";

import icon from "./icon.svg";

export const walletCommand = {
  type: "group",
  command: "wallet",
  title: "Wallet",
  description: "Get wallet data",
  icon,
  onCommand: insertComponent("<balance-component></balance-component>"),
  items: [balanceCommand],
} satisfies CommandListItem<"wallet">;
