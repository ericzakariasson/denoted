import { CommandConfiguration } from "../types";

import { mainnet } from "wagmi/chains";
import { NetWorthConfig } from "./TransactionConfig";
import icon from "./icon.svg";
import { TransactionWidgetProps } from "./Transaction";

export const transactionCommand: CommandConfiguration<TransactionWidgetProps> = {
  command: "transaction",
  title: "Transaction (tx)",
  description: "Gets from, to and amount in a transaction",
  icon,
  blockType: "inline",
  defaultValues: {
    txHash: undefined,
    chain: mainnet.id,
  },
  ConfigComponent: NetWorthConfig,
};
