import { insertComponent } from "../../../lib/tiptap/tiptap";
import { CommandItem } from "../../CommandList";

import icon from "./icon.svg";

export const graphCommand: CommandItem = {
  command: "graph",
  title: "The Graph",
  description: "Query any graph endpoint",
  icon,
  onCommand: insertComponent(`<graph-component></graph-component>`),
};
