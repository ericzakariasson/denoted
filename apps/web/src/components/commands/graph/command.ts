import { CommandConfiguration } from "../types";
import { GraphConfig } from "./Config";
import { GraphWidgetProps } from "./Graph";

import icon from "./icon.svg";

export const graphCommand: CommandConfiguration<GraphWidgetProps> = {
  command: "graph",
  title: "The Graph",
  description: "Query any graph endpoint",
  icon,

  blockType: "inline",
  defaultValues: {
    url: undefined,
    query: undefined,
    path: undefined,
  },
  ConfigComponent: GraphConfig,
};
