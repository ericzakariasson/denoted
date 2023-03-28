import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { Navbar } from "../components/Navbar";
import WagmiProvider from "../components/Web3Provider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as analytics from "../lib/analytics";

const queryClient = new QueryClient({});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handler = (url: string) => {
      analytics.page(url);
    };

    router.events.on("routeChangeComplete", handler);
    return () => {
      router.events.off("routeChangeComplete", handler);
    };
  }, [router.events]);

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
          <Analytics />
        </WagmiProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
