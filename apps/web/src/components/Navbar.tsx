import dynamic from "next/dynamic";
import Link from "next/link";
// import { Connect } from "./Connect";
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
          <Connect />
        </div>
      </div>
    </nav>
  );
};
