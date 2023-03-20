import { PropsWithChildren } from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";

const { provider } = configureChains(
  [mainnet],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY })]
);

const client = createClient({
  autoConnect: true,
  provider,
});

const Web3Provider = ({ children }: PropsWithChildren<unknown>) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export default Web3Provider;
