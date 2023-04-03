import { CommandConfiguration } from "../../../types";
import { LensConfig } from "./LensProfileConfig";

import icon from "./icon.svg";
import { LensWidgetProps } from "./LensProfile";

export const lensProfileCommand: CommandConfiguration<LensWidgetProps> = {
  command: "lens-profile",
  title: "Lens Profile",
  description: "Lens statistics for a profile",
  icon,

  blockType: "inline",
  defaultValues: {
    handle: undefined,
  },
  ConfigComponent: LensConfig,
};
