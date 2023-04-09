import { CommandConfiguration } from "../types";
import { TokenPriceConfig } from "./Config";
import { TokenWidgetProps } from "./Tokens";
import icon from "./icon.svg";
import { supportedChains } from "./helpers";

export const tokenPriceCommand: CommandConfiguration<TokenWidgetProps> = {
  command: "token-price",
  title: "Token price",
  description: "Token price",
  icon,
  blockType: "inline",
  defaultValues: {
    property: "price",
    chainName: supportedChains.ETHEREUM,
    token: undefined,
    platforms: "basic"
  },
  ConfigComponent: TokenPriceConfig,
};
