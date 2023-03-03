import { useAccount, useConnect, useDisconnect } from "wagmi";
export const Navbar = () => {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  console.log(isConnected);

  console.log(connector)
  return (
    <nav className="rounded border-gray-200 bg-white px-2 py-2.5 dark:bg-gray-900 sm:px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Denoted
        </span>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium md:dark:bg-gray-900">
            <li>
              <a
                href="#"
                className="block rounded bg-blue-700 py-2 pl-3 pr-4 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700"
                aria-current="page"
              >
                <div className="main">
                  {connectors.map((connector) => (
                    <button
                      className="card"
                      disabled={!connector?.ready}
                      key={connector?.id}
                      onClick={() => connect({ connector })}
                    >
                      {connector?.name}
                      {!connector?.ready && " (unsupported)"}
                      {isLoading &&
                        connector.id === pendingConnector?.id &&
                        " (connecting)"}
                    </button>
                  ))}
                  {error && <div>{error.message}</div>}
                </div>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block rounded bg-blue-700 py-2 pl-3 pr-4 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700"
                aria-current="page"
              ></a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
