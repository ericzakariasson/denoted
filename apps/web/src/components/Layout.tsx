import { PropsWithChildren } from "react";
import { cn } from "../lib/utils";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import Head from "next/head";

export function formatTitle(title: string) {
  const maxLength = 50;
  if (title.length > maxLength) {
    return `${title.slice(0, maxLength - 3)}... — denoted`;
  }
  return `${title.trim().length > 0 ? title : "Untitled"} — denoted`;
}

type LayoutProps = PropsWithChildren<{
  className?: string;
  title?: string;
}>;

export function Layout({ children, className, title }: LayoutProps) {
  return (
    <>
      {title && (
        <Head>
          <title className="break-all">{title ? formatTitle(title) : "denoted"}</title>
        </Head>
      )}
      <div className={cn("grid min-h-screen")}>
        <Sidebar className="fixed w-64" />
        <div className="py-4 pl-64">
          <Header className="absolute right-0 top-0 p-4" />
          <main className={cn("m-auto h-full max-w-3xl px-4", className)}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
