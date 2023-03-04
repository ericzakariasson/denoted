import { insertComponent } from "../../../lib/tiptap/tiptap";
import { CommandItem } from "../../CommandList";

import icon from "./icon.svg";

export const lensCommand: CommandItem = {
  command: "lens",
  title: "Lens",
  description: "Lens statistics for a profile",
  icon,
  onCommand: insertComponent(`<lens-component></lens-component>`),
};
