import { insertComponent } from "../../../lib/tiptap/tiptap";
import { CommandItem } from "../../CommandList";

import icon from "./icon.svg";

export const netWorthCommand: CommandItem = {
  command: "net-worth",
  title: "Net Worth",
  description: "Net worth in USD",
  icon,
  onCommand: insertComponent("<net-worth-component></net-worth-component>"),
};
