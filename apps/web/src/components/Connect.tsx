"use client";

import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { formatEthAddress } from "../utils";

export const Connect = () => {
  const { isConnected, address, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect({
    onSuccess: () => localStorage.removeItem("did"),
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
