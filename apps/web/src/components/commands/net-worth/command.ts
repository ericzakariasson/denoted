import { CommandConfiguration } from "../types";

import { mainnet } from "wagmi/chains";
import { NetWorthConfig } from "./Config";
import icon from "./icon.svg";
import { NetWorthWidgetProps } from "./NetWorth";

export const netWorthCommand: CommandConfiguration<NetWorthWidgetProps> = {
  command: "net-worth",
  title: "Net Worth",
  description: "Net worth in USD",
  icon,

  blockType: "inline",
  defaultValues: {
    address: undefined,
    chain: mainnet.id,
  },
  ConfigComponent: NetWorthConfig,
};
