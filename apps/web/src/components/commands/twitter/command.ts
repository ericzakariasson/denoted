import { CommandConfiguration } from "../types";
import { TweetConfig } from "./Config";

import icon from "./icon.png";

export const tweetCommand: CommandConfiguration<{
  src: string;
}> = {
  command: "tweet",
  title: "Tweet",
  description: "Embed a tweet",
  icon,
  blockType: "block",
  defaultValues: {
    src: undefined,
  },
  ConfigComponent: TweetConfig,
};
