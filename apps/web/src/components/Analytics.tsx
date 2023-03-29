import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { identify, trackPage } from "../lib/analytics";

export function Analytics() {
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      identify(address);
    }
  }, [address]);

  const router = useRouter();

  useEffect(() => {
    const handler = (url: string) => {
      trackPage(url);
    };

    router.events.on("routeChangeComplete", handler);
    return () => {
      router.events.off("routeChangeComplete", handler);
    };
  }, [router.events]);

  return null;
}
