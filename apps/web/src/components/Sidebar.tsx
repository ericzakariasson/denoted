import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "./Logo";
import { cn } from "../utils/classnames";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col items-start gap-6 bg-gray-100 p-4",
        className
      )}
    >
      <header>
        <div className="flex justify-center">
          <Link href={`/`}>
            <Logo />
          </Link>
        </div>
      </header>
      <nav className="w-full">
        <ul className="flex flex-col gap-6">
          <li className="flex flex-col gap-3">
            <Link
              href="/create"
              className={
                "shadow-m flex w-full justify-between rounded-xl bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-gray-700 to-gray-900 px-4 py-3 leading-tight text-white"
              }
            >
              <span>Create page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </Link>
            <Link
              href="/explore"
              className={
                "flex w-full justify-between rounded-xl border border-gray-700 px-4 py-3 leading-tight text-gray-700 shadow-sm"
              }
            >
              <span>Explore</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
            </Link>
          </li>
          <li>
            <span className="text-sm text-gray-400">Pages</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
