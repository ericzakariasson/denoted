import { getDefaultClient, ConnectKitProvider } from "connectkit";
import { PropsWithChildren } from "react";
import { createClient, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";

const client = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: "denoted",
    infuraId: process.env.NEXT_PUBLIC_INFURA_KEY as string,
    chains: [mainnet],
  })
);

export const Web3Provider = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
};
