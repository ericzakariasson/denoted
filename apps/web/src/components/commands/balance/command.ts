import { CommandConfiguration } from "../types";
import { WalletBalanceWidgetProps } from "./Balance";
import { WalletBalanceWidgetConfig } from "./Config";

import { mainnet } from "wagmi/chains";
import icon from "./icon.svg";

export const balanceCommand: CommandConfiguration<WalletBalanceWidgetProps> = {
  command: "balance",
  title: "Balance",
  description: "Use Covalent API to get balance",
  icon,
  blockType: "inline",
  defaultValues: {
    address: undefined,
    symbol: mainnet.nativeCurrency.symbol,
    chain: mainnet.id,
  },
  ConfigComponent: WalletBalanceWidgetConfig,
};
