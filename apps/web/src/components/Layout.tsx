import { PropsWithChildren } from "react";
import { cn } from "../lib/utils";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type LayuotProps = PropsWithChildren<{
  className?: string;
}>;

export function Layout({ children, className }: LayuotProps) {
  return (
    <div className={cn("grid min-h-screen")}>
      <Sidebar className="fixed w-64" />
      <div className="py-4 pl-64">
        <Header className="absolute right-0 top-0 p-4" />
        <main className={cn("m-auto h-full max-w-3xl px-4", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
