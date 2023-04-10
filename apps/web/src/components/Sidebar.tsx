import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "./Logo";
import { cn } from "../utils/classnames";
import { useQuery } from "react-query";
import { getPagesQuery } from "../composedb/page";
import { composeClient } from "../lib/compose";
import { DecryptedText } from "./DecryptedText";
import { useCeramic } from "../hooks/useCeramic";
import { useAccount } from "wagmi";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const { isConnected } = useAccount();
  const ceramic = useCeramic();
  const myPagesQuery = useQuery(
    ["PAGES", composeClient.id],
    async () => {
      const query = await getPagesQuery();
      const pages = query.data?.pageIndex?.edges.map((edge) => edge.node) ?? [];
      const myPages = pages.filter(
        (page) => page.createdBy.id === composeClient.id
      );
      return myPages;
    },
    { enabled: isConnected && ceramic.isInitialized }
  );

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
          {isConnected && ceramic.isInitialized && (
            <li>
              <span className="mb-4 block text-sm text-gray-400">Pages</span>
              <ul className="flex flex-col gap-3">
                {myPagesQuery.data?.map((page) => {
                  return (
                    <li key={page.id}>
                      <Link
                        href={`/${page.id}`}
                        className="block rounded-lg border border-gray-300 bg-gray-200 p-2 px-3"
                      >
                        {page.key ? (
                          <DecryptedText
                            encryptionKey={page.key}
                            value={page.title}
                          />
                        ) : (
                          page.title
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
