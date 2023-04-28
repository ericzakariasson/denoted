import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import "../styles/globals.css";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { Analytics } from "../components/Analytics";
import { InitializeCeramic } from "../components/Sessions";
import { Web3Provider } from "../components/Web3Provider";
import { cn } from "../utils/classnames";
import { Toaster } from "../components/Toaster";

const queryClient = new QueryClient({});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Web3Provider>
          <InitializeCeramic />
          <div className={cn(inter.className)}>
            <Component {...pageProps} />
            <Toaster />
          </div>
          <Analytics />
          <VercelAnalytics />
        </Web3Provider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
