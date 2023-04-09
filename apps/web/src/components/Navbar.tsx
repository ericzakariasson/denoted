import dynamic from "next/dynamic";
import Link from "next/link";
// import { Connect } from "./Connect";
import { cn } from "../utils/classnames";
import { Logo } from "./Logo";

const Connect = dynamic(() => import("./Connect").then((x) => x.Connect), {
  ssr: false,
});

type NavbarProps = {
  className: string;
};

export const Navbar = ({ className }: NavbarProps) => {
  return (
    <nav className={"mx-auto max-w-3xl p-4" + " " + className}>
      <div className="flex items-center justify-between">
        <Link href={`/`}>
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Link href={`/explore`}>Explore</Link>
          <Link
            href={`/create`}
            className={cn(
              "rounded-xl border border-gray-700 bg-white px-5 py-2 leading-tight text-gray-700 shadow-sm"
            )}
          >
            Create
          </Link>
          <Connect />
        </div>
      </div>
    </nav>
  );
};
