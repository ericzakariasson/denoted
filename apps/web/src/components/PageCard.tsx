import { Avatar } from "connectkit";
import Timeago from "react-timeago";
import { Address, useEnsName } from "wagmi";
import { Database } from "../lib/supabase/supabase.types";
import { truncate } from "../utils/index";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";

type PageCardProps = {
  publication: Database["public"]["Tables"]["page_publication"]["Row"];
};

export const PageCard = ({ publication }: PageCardProps) => {
  const ens = useEnsName({
    address: publication.publisher_address as Address,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{publication.page_title}</CardTitle>
        <CardDescription>
          <Timeago date={publication.created_at} />
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            size={24}
            address={publication.publisher_address as Address}
          />
          {ens.isSuccess ? ens.data : truncate(publication.publisher_address)}
        </div>
        <Link
          href={`/p/${publication.id}`}
          target="_blank"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          View
          <ExternalLink className="ml-2 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};
