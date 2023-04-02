import { CommandConfiguration } from "../../../types";
import { LensConfig } from "./Config";

import icon from "./icon.svg";
import { LensWidgetProps } from "./Lens";

export const lensCommand: CommandConfiguration<LensWidgetProps> = {
  command: "lens",
  title: "Lens",
  description: "Lens statistics for a profile",
  icon,

  blockType: "inline",
  defaultValues: {
    handle: undefined,
  },
  ConfigComponent: LensConfig,
};
