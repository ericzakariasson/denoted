import { CommandConfiguration } from "../types";

import { TallyConfig } from "./Config";
import icon from "./icon.png";
import { TallyWidgetProps } from "./Tally";

export const tallyCommand: CommandConfiguration<TallyWidgetProps> = {
  command: "tally",
  title: "Tally",
  description: "Get DAO data with Tally",
  icon,
  blockType: "inline",
  defaultValues: {
    path: undefined,
    query: undefined,
  },
  ConfigComponent: TallyConfig,
};
