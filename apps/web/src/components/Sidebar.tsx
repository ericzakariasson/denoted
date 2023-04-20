import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { getPagesQuery } from "../composedb/page";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { composeClient } from "../lib/compose";
import { cn } from "../utils/classnames";
import { DecryptedText } from "./DecryptedText";
import { Logo } from "./Logo";
import { Footer } from "./Footer";
import { Compass, PenBox } from "lucide-react";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const [isCeramicSessionValid, setIsCeramicSessionValid] = useState(false);

  const ceramic = useCeramic();
  const lit = useLit();
  const account = useAccount();

  useEffect(() => {
    const run = async () =>
      setIsCeramicSessionValid(await ceramic.hasSession());
    run();
  }, [ceramic]);

  const isAuthenticated =
    account.isConnected &&
    ceramic.isComposeResourcesSigned &&
    isCeramicSessionValid &&
    lit.isLitAuthenticated;

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
    {
      enabled: isAuthenticated,
    }
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
              <PenBox size={20} strokeWidth={1.5} />
            </Link>
            <Link
              href="/explore"
              className={
                "flex w-full justify-between rounded-xl border border-gray-700 px-4 py-3 leading-tight text-gray-700 shadow-sm"
              }
            >
              <span>Explore</span>
              <Compass size={20} strokeWidth={1.5} />
            </Link>
          </li>
          {isAuthenticated && (
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
      <Footer className="mt-auto" />
    </aside>
  );
}
