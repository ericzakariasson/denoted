import { SUPPORTED_CHAINS } from "../../utils";

const chainTable = [
  ["chain id", "name", "network", "symbol"].join(","),
  ...SUPPORTED_CHAINS.map(({ id, name, network, nativeCurrency }) =>
    [id, name, network, nativeCurrency.symbol].join(",")
  ),
];

export const CHAIN_CONTEXT = [
  "Here are all the available chains and their respective information in a table:",
  ...chainTable,
].join("\n");
