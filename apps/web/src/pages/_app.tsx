import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import "../styles/globals.css";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { Analytics } from "../components/Analytics";
import { InitializeCeramic } from "../components/Sessions";
import { Sidebar } from "../components/Sidebar";
import { Web3Provider } from "../components/Web3Provider";
import { cn } from "../utils/classnames";
import { Header } from "../components/Header";
import { Toaster } from "../components/Toaster";

const queryClient = new QueryClient({});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Web3Provider>
          <InitializeCeramic />
          <div className={cn("min-h-screen", inter.className)}>
            <Sidebar className="fixed w-64" />
            <div className="py-4 pl-64">
              <Header className="absolute top-0 right-0 p-4" />
              <main className="m-auto max-w-3xl px-4">
                <Component {...pageProps} />
                <Toaster />
              </main>
            </div>
          </div>
          <Analytics />
          <VercelAnalytics />
        </Web3Provider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
