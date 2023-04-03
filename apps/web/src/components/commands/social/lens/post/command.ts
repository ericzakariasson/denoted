import { CommandConfiguration } from "../../../types";
import { LensConfig } from "./Config";

import icon from "./icon.svg";
import { LensWidgetProps } from "./Lens";

export const lensPostCommand: CommandConfiguration<LensWidgetProps> = {
  command: "lens",
  title: "Lens Post",
  description: "Lens post for a profile",
  icon,

  blockType: "inline",
  defaultValues: {
    publicationId: undefined,
  },
  ConfigComponent: LensConfig,
};
