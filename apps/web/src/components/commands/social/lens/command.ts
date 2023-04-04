import { CommandConfiguration } from "../../types";
import { LensConfig } from "./Config";
import icon from "./icon.svg";
import { LensWidgetProps } from "./Lens";


export const lensProfileCommand: CommandConfiguration<LensWidgetProps> = {
  command: "lens-profile",
  title: "Lens Profile",
  description: "Lens statistics for a profile",
  icon,

  blockType: "block",
  defaultValues: {
    property: "handle",
    handle: undefined
  },
  ConfigComponent: LensConfig,
};

export const lensPostCommand: CommandConfiguration<LensWidgetProps> = {
  command: "lens-post",
  title: "Lens Post",
  description: "Lens post for a profile",
  icon,

  blockType: "block",
  defaultValues: {
    property: "publicationId",
    publicationId: undefined
  },
  ConfigComponent: LensConfig,
};


