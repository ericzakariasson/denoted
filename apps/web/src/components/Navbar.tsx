import Link from "next/link";
import { useAccount, useConnect } from "wagmi";
import { formatEthAddress } from "../utils/index";
import { useDisconnect } from "wagmi";

export const Navbar = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <nav className="mx-auto max-w-3xl p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-semibold dark:text-white">
          denoted
        </Link>
        <div>
          {connectors.map((connector) => (
            <button
              className="rounded-full border border-black px-2 py-0"
              key={connector?.id}
              onClick={() =>
                isConnected ? disconnect() : connect({ connector })
              }
            >
              {isConnected && address
                ? formatEthAddress(address, 5, 40)
                : "connect"}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
