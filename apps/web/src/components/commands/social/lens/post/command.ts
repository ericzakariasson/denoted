import { CommandConfiguration } from "../../../types";
import { LensConfig } from "./LensPostConfig";

import icon from "./icon.svg";
import { LensWidgetProps } from "./LensPost";

export const lensPostCommand: CommandConfiguration<LensWidgetProps> = {
  command: "lens-post",
  title: "Lens Post",
  description: "Lens post for a profile",
  icon,

  blockType: "inline",
  defaultValues: {
    publicationId: undefined,
  },
  ConfigComponent: LensConfig,
};
