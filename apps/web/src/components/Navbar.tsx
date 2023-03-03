import { useAccount, useConnect } from "wagmi";
import { formatEthAddress } from "../utils/index";
import { useDisconnect } from "wagmi";

export const Navbar = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <nav className="mx-auto max-w-3xl py-4 px-4">
      <div className="flex items-center justify-between">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          denoted
        </span>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium md:dark:bg-gray-900">
            <li>
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
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
