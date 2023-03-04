import { PropsWithChildren } from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";

import Web3AuthConnectorInstance from "../lib/web3auth";

const { chains, provider } = configureChains([mainnet], [infuraProvider()]);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [Web3AuthConnectorInstance(chains as any)],
  provider,
});

const Web3Provider = ({ children }: PropsWithChildren<unknown>) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export default Web3Provider;
