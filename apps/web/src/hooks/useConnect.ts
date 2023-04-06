import { useConnect } from "wagmi";
import { identify, trackEvent, EventProperties } from "../lib/analytics";

type UseCustomConnectProps = {
  eventProperties?: EventProperties;
};

export function useCustomConnect({
  eventProperties,
}: UseCustomConnectProps = {}): ReturnType<typeof useConnect> {
  return useConnect({
    onSuccess: (data) => {
      identify(data.account);
      trackEvent("Wallet Connected", {
        chainId: data.chain.id,
        ...eventProperties,
      });
    },
  });
}
