import dynamic from "next/dynamic";
import Link from "next/link";
// import { Connect } from "./Connect";
import { Logo } from "./Logo";
import { useAccount } from "wagmi";
import { cn } from "../utils/classnames";

const Connect = dynamic(() => import("./Connect").then((x) => x.Connect), {
  ssr: false,
});

type NavbarProps = {
  className: string;
};

export const Navbar = ({ className }: NavbarProps) => {
  const { isConnected } = useAccount();
  return (
    <nav className={"mx-auto max-w-3xl p-4" + " " + className}>
      <div className="flex items-center justify-between">
        <Link href={`/`}>
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Link href={`/explore`}>Explore</Link>
          {isConnected ? (
            <Link
              href={`/create`}
              className={cn(
                "rounded-xl border border-gray-700 bg-white px-5 py-2 leading-tight text-gray-700 shadow-sm"
              )}
            >
              Create
            </Link>
          ) : (
            <Link
              href={`/get-started`}
              className={cn(
                "rounded-xl border border-gray-700 bg-white px-5 py-2 leading-tight text-gray-700 shadow-sm"
              )}
            >
              Get started
            </Link>
          )}
          <Connect />
        </div>
      </div>
    </nav>
  );
};
