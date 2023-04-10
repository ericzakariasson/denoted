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
import { Sidebar } from "../components/Sidebar";
import { cn } from "../utils/classnames";

const queryClient = new QueryClient({});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <WagmiProvider>
          <InitializeCeramic />
          <div className={cn("min-h-screen", inter.className)}>
            <Sidebar className="fixed w-64" />
            <div className="pl-64">
              <main className="m-auto max-w-3xl p-4 px-4 py-8">
                <Component {...pageProps} />
              </main>
            </div>
          </div>
          <Analytics />
          <VercelAnalytics />
        </WagmiProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
