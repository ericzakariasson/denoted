import { PropsWithChildren } from "react";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";

import Web3AuthConnectorInstance from "../lib/web3auth";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, arbitrum, polygon],
  [infuraProvider()]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [Web3AuthConnectorInstance(chains as any)],
  provider,
  webSocketProvider,
});

const Web3Provider = ({ children }: PropsWithChildren<unknown>) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export default Web3Provider;
