"use client";

import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { identify, trackEvent } from "../lib/analytics";
import { formatEthAddress } from "../utils";
import { cn } from "../utils/classnames";
export const Connect = () => {
  const { isConnected, address, isConnecting } = useAccount();
  const { connect, connectors } = useConnect({
    onSuccess: (data) => {
      identify(data.account);
      trackEvent("Wallet Connected", {
        chainId: data.chain.id,
      });
    },
  });
  const { disconnect } = useDisconnect({
    onSuccess: () => {
      trackEvent("Wallet Disconnected");
      localStorage.removeItem("did");
    },
  });

  const { data: ensName } = useEnsName({
    address,
  });

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className={cn(
          "rounded-xl from-gray-100 to-gray-200 px-5 py-2 leading-tight text-gray-800 enabled:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] enabled:shadow-md disabled:bg-gray-300"
        )}
      >
        {ensName ?? formatEthAddress(address, 5, 40)}
      </button>
    );
  }

  return (
    <>
      {connectors.map((connector) => (
        <button
          className={cn(
            "rounded-xl from-gray-700 to-gray-900 px-5 py-2 leading-tight text-white enabled:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] enabled:shadow-md disabled:bg-gray-300"
          )}
          key={connector?.id}
          onClick={() => connect({ connector })}
        >
          {isConnecting && <p>Connecting...</p>}
          {!isConnected && !isConnecting && <p>Connect</p>}
        </button>
      ))}
    </>
  );
};
