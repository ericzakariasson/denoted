import { umask } from "process";
import { cn } from "../utils/classnames";
import { TwitterIcon, EmailIcon } from "react-share";
import { Mail, Twitter } from "lucide-react";
import Link from "next/link";

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-4 text-slate-500">
        <Link
          href="https://twitter.com/denotedxyz"
          target="_blank"
          rel="noreferrer"
        >
          <Twitter strokeWidth={1.5} />
        </Link>
        <Link href="mailto:hey@denoted.xyz" target="_blank" rel="noreferrer">
          <Mail strokeWidth={1.5} />
        </Link>
      </div>
      <p className="flex flex-col gap-1 text-[10px] text-slate-500">
        Copyright © 2023 denoted.
        <span>All rights reserved.</span>
      </p>
    </footer>
  );
}
