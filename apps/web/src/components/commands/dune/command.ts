import { insertComponent } from "../../../lib/tiptap/tiptap";
import { CommandItem } from "../../CommandList";

import icon from "./icon.png";

export const duneCommand: CommandItem = {
  command: "dune",
  title: "Dune",
  description: "Embed Dune Analytics queries",
  icon,
  onCommand: insertComponent(`<iframe-component></iframe-component>`),
};
