import { mainnet } from "wagmi/chains";
import { CommandConfiguration } from "../types";
import { TokenPriceConfig } from "./Config";
import { TokenWidgetProps } from "./Tokens";

export const tokenPriceCommand: CommandConfiguration<TokenWidgetProps> = {
  command: "token-price",
  title: "Token price",
  description: "Token price",
  icon: null,
  blockType: "inline",
  defaultValues: {
    property: "price",
    chainName: mainnet.name.toLowerCase(),
    token: undefined,
    platforms: "basic"
  },
  ConfigComponent: TokenPriceConfig,
};
