import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Navbar = () => {
  return (
    <nav className="m-auto max-w-2xl rounded py-2.5">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          denoted
        </span>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium md:dark:bg-gray-900">
            <li>
              <a
                href="/create"
                className="block rounded bg-blue-700 py-2 pl-3 pr-4 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700"
                aria-current="page"
              >
                create
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block rounded bg-blue-700 py-2 pl-3 pr-4 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700"
                aria-current="page"
              >
                <ConnectButton
                  showBalance={false}
                  chainStatus={"none"}
                  accountStatus={"address"}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
