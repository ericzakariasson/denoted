import { insertComponent } from "../../../lib/tiptap/tiptap";
import { CommandItem } from "../../CommandList";

import icon from "./icon.svg";

export const balanceCommand = {
  command: "balance",
  title: "Balance",
  description: "Use Covalent API to get balance",
  icon,
  onCommand: insertComponent("<balance-component></balance-component>"),
} satisfies CommandItem<"balance">;
