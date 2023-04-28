import { CommandConfiguration } from "../types";
import { TokenPriceConfig } from "./Config";
import { TokenWidgetProps } from "./Tokens";
import icon from "./icon.svg";
import { mainnet } from "wagmi";

export const tokenPriceCommand: CommandConfiguration<TokenWidgetProps> = {
  command: "token-price",
  title: "Token price",
  description: "Token price",
  icon,
  blockType: "inline",
  defaultValues: {
    property: "price",
    chainId: mainnet.id,
    token: undefined,
  },
  ConfigComponent: TokenPriceConfig,
};
