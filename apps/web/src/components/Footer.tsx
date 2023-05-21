import { cn } from "../utils/classnames";
import { Mail, Twitter, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-3 text-slate-500">
        <Link
          href="https://twitter.com/denotedxyz"
          target="_blank"
          rel="noreferrer"
        >
          <Twitter className="h-4 w-4" />
        </Link>
        <Link href="mailto:hey@denoted.xyz" target="_blank" rel="noreferrer">
          <Mail className="h-4 w-4" />
        </Link>
        <Link
          href="https://t.me/+32GAGJbEzj5mNjQ0"
          target="_blank"
          rel="noreferrer"
        >
          <Send className="h-4 w-4" />
        </Link>
      </div>
      <p className="flex flex-col gap-1 text-[10px] text-slate-500">
        Copyright © 2023 denoted.
        <span>All rights reserved.</span>
      </p>
    </footer>
  );
}
