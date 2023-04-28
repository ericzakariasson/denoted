import * as Sentry from "@sentry/nextjs";
import { PropsWithChildren, useEffect } from "react";
import { QueryStatus, UseQueryResult } from "react-query";
import { cn } from "../utils/classnames";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

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
  const isStatus = (s: QueryStatus) =>
    [query.status, status].some((x) => x === s);

  useEffect(() => {
    if (query.isError) {
      Sentry.captureException(query.error);
    }
  }, [query.isError, query.error]);

  if (isStatus("loading")) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "text-md rela relative h-6 w-20 animate-pulse overflow-hidden p-0 font-normal text-inherit",
          className
        )}
      >
        <Skeleton className="absolute h-full w-full" />
        <span className="opacity-0">loading</span>
      </Badge>
    );
  }

  if (isStatus("error")) {
    const message =
      "message" in (query.error as any)
        ? (query.error as any).message
        : "something went wrong...";
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Badge
              variant="outline"
              className={cn(
                "text-md h-6 border-red-400 px-1 py-0 font-normal text-inherit"
              )}
            >
              error
            </Badge>
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

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-md relative h-6 border-slate-300 px-1 py-0 font-normal text-inherit",
        className
      )}
    >
      {children}
    </Badge>
  );
};
