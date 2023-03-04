import { insertComponent } from "../../../lib/tiptap/tiptap";
import { CommandItem } from "../../CommandList";

import icon from "./icon.svg";

export const balanceCommand: CommandItem = {
  command: "balance",
  title: "Balance",
  description: "Get wallet balance for an account",
  icon,
  onCommand: insertComponent("<balance-component></balance-component>"),
};
