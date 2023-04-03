import { CommandConfiguration } from "../../../types";
import { LensConfig } from "./Config";

import icon from "./icon.svg";
import { LensWidgetProps } from "./Lens";

export const lensProfileCommand: CommandConfiguration<LensWidgetProps> = {
  command: "lens",
  title: "Lens Profile",
  description: "Lens statistics for a profile",
  icon,

  blockType: "inline",
  defaultValues: {
    handle: undefined,
  },
  ConfigComponent: LensConfig,
};
