import "../styles/globals.scss";

import type { AppProps } from "next/app";
import React from "react";
import { Hydrate } from "react-query";
import { QueryClient, QueryClientProvider } from "react-query";

import WagmiProvider from "../components/Web3Provider";

const queryClient = new QueryClient({});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <WagmiProvider>
          <Component {...pageProps} />
        </WagmiProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
