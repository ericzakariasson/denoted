import { cn } from "../utils/classnames";
import { PropsWithChildren } from "react";
import { QueryStatus, UseQueryResult } from "react-query";
import ContentLoader from "react-content-loader";
import * as Sentry from "@sentry/nextjs";

import * as Tooltip from "@radix-ui/react-tooltip";

type DataPillProps = PropsWithChildren<{
  query: UseQueryResult;
  className?: string;
  status?: QueryStatus;
}>;

export const DataPill = ({
  className,
  query,
  status,
  children,
}: DataPillProps) => {
  const base = "rounded-full px-1 py-0";

  const isStatus = (s: QueryStatus) =>
    [query.status, status].some((x) => x === s);

  if (isStatus("loading")) {
    return (
      <span
        className={cn(base, "relative top-1 inline-flex overflow-hidden p-0")}
      >
        <ContentLoader
          speed={2}
          width={85}
          height={18.5}
          viewBox="0 0 85 18.5"
          backgroundColor="#f3f3f3"
          foregroundColor="#e3e3e3"
        >
          <rect x="0" y="0" rx="0" ry="0" width="85" height="18.5" />
        </ContentLoader>
      </span>
    );
  }

  if (isStatus("error")) {
    Sentry.captureException(query.error);
    const message =
      "message" in (query.error as any)
        ? (query.error as any).message
        : "something went wrong...";
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <span className={cn(base, "bg-red-200")}>error</span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>
              <p>{message}</p>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return <span className={cn(base, "bg-gray-200", className)}>{children}</span>;
};
