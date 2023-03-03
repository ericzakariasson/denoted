import "../styles/globals.css";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import type { AppProps } from "next/app";
import React from "react";
import { Hydrate } from "react-query";
import { QueryClient, QueryClientProvider } from "react-query";
import { Navbar } from "../components/Navbar";
import WagmiProvider from "../components/Web3Provider";

const queryClient = new QueryClient({});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <WagmiProvider>
          <Navbar className={inter.className} />
          <main
            className={"m-auto max-w-3xl px-4 py-8" + " " + inter.className}
          >
            <Component {...pageProps} />
          </main>
        </WagmiProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
