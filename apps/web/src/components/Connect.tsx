"use client";

import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { identify, trackEvent } from "../lib/analytics";
import { formatEthAddress } from "../utils";
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

  return (
    <>
      {connectors.map((connector) => (
        <button
          className="rounded-full border border-black px-2 py-0"
          key={connector?.id}
          onClick={() => connect({ connector })}
        >
          {isConnected && address && (
            <p onClick={() => disconnect()}>
              {ensName ?? formatEthAddress(address, 5, 40)}
            </p>
          )}
          {isConnecting && <p>connecting...</p>}
          {!isConnected && !isConnecting && <p>connect</p>}
        </button>
      ))}
    </>
  );
};
