import Link from "next/link";
import { useAccount, useConnect } from "wagmi";
import { formatEthAddress } from "../utils/index";
import { useDisconnect } from "wagmi";
import { Logo } from "./Logo";

type NavbarProps = {
  className: string;
};

export const Navbar = ({ className }: NavbarProps) => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <nav className={"mx-auto max-w-3xl p-4" + " " + className}>
      <div className="flex items-center justify-between">
        <Link href={`/`}>
          <Logo />
        </Link>
        <div className="flex gap-4">
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
                  {formatEthAddress(address, 5, 40)}
                </p>
              )}
              {!isConnected && <p>connect</p>}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
