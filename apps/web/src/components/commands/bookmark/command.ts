import { CommandConfiguration } from "../types";
import { BookmarkConfig } from "./Config";
import { BookmarkProps } from "./bookmark";

import icon from "./icon.png";

export const bookmarkCommand: CommandConfiguration<BookmarkProps> = {
  command: "bookmark",
  title: "Bookmark",
  description: "Create a bookmark from web link",
  icon,
  blockType: "block",
  defaultValues: {
    src: undefined,
  },
  ConfigComponent: BookmarkConfig,
};
