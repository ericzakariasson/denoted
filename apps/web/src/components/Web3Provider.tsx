import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.rinkeby],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "anotherblock-allowlist",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const Web3Provider = ({ children }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        appInfo={{
          appName: "My App",
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
