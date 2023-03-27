import { CommandConfiguration } from "../types";
import { DuneConfig } from "./Config";
import { DuneProps } from "./Dune";

import icon from "./icon.png";

export const duneCommand: CommandConfiguration<DuneProps> = {
  command: "dune",
  title: "Dune",
  description: "Embed Dune Analytics queries",
  icon,
  blockType: "block",
  defaultValues: {
    src: undefined,
  },
  ConfigComponent: DuneConfig,
};
