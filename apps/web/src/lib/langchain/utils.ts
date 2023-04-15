import { SUPPORTED_CHAINS } from '../../utils';

const chainTable = SUPPORTED_CHAINS.map(
  ({ id, name, network, nativeCurrency }) =>
    [id, name, network, nativeCurrency.symbol].join(",")
);

export const chainContext = [
  ["chain id", "name", "network", "symbol"].join(","),
  ...chainTable,
].join("\n");