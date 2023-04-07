import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import "../styles/globals.css";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { Analytics } from "../components/Analytics";
import { Navbar } from "../components/Navbar";
import WagmiProvider from "../components/Web3Provider";
import { InitializeCeramic } from "../components/Sessions";

const queryClient = new QueryClient({});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <WagmiProvider>
          <InitializeCeramic />
          <Navbar className={inter.className} />
          <main
            className={"m-auto max-w-3xl px-4 py-8" + " " + inter.className}
          >
            <Component {...pageProps} />
          </main>
          <Analytics />
          <VercelAnalytics />
        </WagmiProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
