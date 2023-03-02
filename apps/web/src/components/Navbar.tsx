import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Navbar = () => {
  return (
    <nav className="mx-auto max-w-3xl py-4 px-4">
      <div className="flex items-center justify-between">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          denoted
        </span>
        <ul className="mt-4 flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium md:dark:bg-gray-900">
          <li>
            <a
              href="/create"
              className="block rounded py-2 pl-3 pr-4 text-white dark:text-white "
            >
              create
            </a>
          </li>
          <li>
            <ConnectButton
              showBalance={false}
              chainStatus={"none"}
              accountStatus={"address"}
            />
          </li>
        </ul>
      </div>
    </nav>
  );
};
