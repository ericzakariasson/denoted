import LensIcon from "@lens-protocol/widgets-react/dist/LensIcon";
import React, { useState } from "react";
import { getBaseUrl } from "../utils/base-url";
import { useMutation, useQuery } from "react-query";
import { DeserializedPage } from "../utils/page-helper";
import { Database } from "../lib/supabase/supabase.types";
import { Share, Link as LinkIcon, TwitterIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";
import { useToast } from "./ui/use-toast";
import * as IpfsImage from './commands/ipfs-image';
import { JSONContent } from "@tiptap/react";

async function onPublishContent(blocks: JSONContent[], encryptionKey: CryptoKey | undefined) : Promise<JSONContent[]> {
  return await Promise.all(blocks.map(async (block) => {
    if (block.content) {
      block.content = await onPublishContent(block.content, encryptionKey);
    }

    if (block.type === IpfsImage.extension.name) {
      block.attrs = await IpfsImage.onPublish(block.attrs, encryptionKey);
    }

    return block;
  }));
}

const generateTweetLink = (title: string, url: string) => {
  const base = "https://twitter.com/intent/tweet";
  const text = [`check out ${title} on denoted`, url].join("\n\n");

  const params = new URLSearchParams({
    text,
  });

  return `${base}?${params.toString()}`;
};

export type PublishmenuProps = {
  page: DeserializedPage;
  encryptionKey: CryptoKey | undefined;
};

export const PublishMenu: React.FC<PublishmenuProps> = ({ page, encryptionKey }) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  const { toast } = useToast();

  const publishMutation = useMutation(
    async () => {
      const pageToPublish = structuredClone(page);

      pageToPublish.data = await onPublishContent(pageToPublish.data, encryptionKey);

      const response = await fetch("/api/page/publish", {
        method: "POST",
        body: JSON.stringify({ page: pageToPublish }),
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      return json;
    },
    {
      onSuccess: (data) => {
        toast({
          title: "Published page 🚀",
          description: `Your page has been published to IPFS. See it at ${getBaseUrl()}/p/${
            data.id
          }`,
        });
        publicationsQuery.refetch();
      },
    }
  );

  const publicationsQuery = useQuery(["PUBLICATIONS", page.id], async () => {
    const response = await fetch(`/api/page/publications?pageId=${page.id}`);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const json: Database["public"]["Tables"]["page_publication"]["Row"][] =
      await response.json();

    return json;
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <Share className="mr-2 h-4 w-4" />
          <span>Publish</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="mb-2 text-sm text-slate-500">Publications</p>
        <div className="flex w-full flex-col gap-4">
          <Button
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isLoading}
          >
            {publishMutation.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Share className="mr-2 h-4 w-4" />
            )}
            Publish to IPFS
          </Button>
          {publicationsQuery.data?.slice(0, 1).map((publication) => {
            const url = `${getBaseUrl()}/p/${publication.id}`;

            return (
              <div className="flex w-full flex-col gap-3" key={publication.id}>
                <h3 className="text-sm text-slate-500">Latest publication</h3>
                <Button
                  variant={"outline"}
                  onClick={() => copyToClipboard(url)}
                >
                  {isCopied ? null : <LinkIcon className="mr-2 h-4 w-4" />}
                  <span>{isCopied ? "Copied!" : "Copy Link"}</span>
                </Button>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-[#1DA1F2]"
                  )}
                  href={generateTweetLink(page.title, url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TwitterIcon className="mr-2 h-4 w-4" />
                  Share to Twitter
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-[#ABFE2C]"
                  )}
                  href={`https://lenster.xyz/?text=${encodeURIComponent(
                    page.title
                  )}&url=${url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="mr-2 block">
                    <LensIcon />
                  </span>
                  Share to Lens
                </Link>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
