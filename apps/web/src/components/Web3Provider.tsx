import { PropsWithChildren } from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";

const { chains, provider } = configureChains([mainnet], [infuraProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
});

const Web3Provider = ({ children }: PropsWithChildren<unknown>) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export default Web3Provider;
