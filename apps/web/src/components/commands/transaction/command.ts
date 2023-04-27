import type { CommandConfiguration } from "../types";
import { mainnet } from "wagmi/chains";
import { TransactionConfig } from "./Config";
import icon from "./icon.svg";
import { TransactionWidgetProps } from "./Transaction";

export const transactionCommand: CommandConfiguration<TransactionWidgetProps> =
  {
    command: "transaction",
    title: "Transaction (tx)",
    description: "Gets from, to and amount in a transaction",
    icon,
    blockType: "block",
    defaultValues: {
      txHash: undefined,
      chain: mainnet.id,
    },
    ConfigComponent: TransactionConfig,
  };
