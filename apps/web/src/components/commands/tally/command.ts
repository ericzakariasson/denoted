import { insertComponent } from "../../../lib/tiptap/tiptap";
import { CommandItem } from "../../CommandList";

import icon from "./icon.png";

export const tallyCommand: CommandItem = {
  command: "tally",
  title: "Tally",
  description: "Get DAO data with Tally",
  icon,
  onCommand: insertComponent(`<tally-component></tally-component>`),
};
