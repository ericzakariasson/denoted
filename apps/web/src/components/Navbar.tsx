import Link from "next/link";
import { useAccount, useConnect } from "wagmi";
import { formatEthAddress } from "../utils/index";
import { useDisconnect } from "wagmi";
import { Logo } from "./Logo";
import { useEnsName } from "wagmi";

type NavbarProps = {
  className: string;
};

export const Navbar = ({ className }: NavbarProps) => {
  const { isConnected, address, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect({
    onSuccess: () => localStorage.removeItem("did"),
  });
  const { data: ensName } = useEnsName({
    address,
  });

  return (
    <nav className={"mx-auto max-w-3xl p-4" + " " + className}>
      <div className="flex items-center justify-between">
        <Link href={`/`}>
          <Logo />
        </Link>
        <div className="flex gap-2">
          <Link href={`/explore`} className="px-2 py-0 text-black">
            explore
          </Link>
          <Link
            href={`/create`}
            className="rounded-full border border-black bg-black px-2 py-0 text-white"
          >
            create
          </Link>
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
        </div>
      </div>
    </nav>
  );
};
