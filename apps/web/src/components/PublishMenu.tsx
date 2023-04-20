import LensIcon from "@lens-protocol/widgets-react/dist/LensIcon";
import * as Popover from "@radix-ui/react-popover";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { BiLink } from "react-icons/bi";
import { FiShare } from "react-icons/fi";
import { TwitterShareButton } from "react-share";
import { getBaseUrl } from "../utils/base-url";
import { useMutation, useQuery } from "react-query";
import { DeserializedPage } from "../utils/page-helper";
import { Database } from "../lib/supabase/supabase.types";
import { Share, Link as LinkIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";
import { Theme } from "@lens-protocol/widgets-react";

export type PublishmenuProps = {
  page: DeserializedPage;
};

export const PublishMenu: React.FC<PublishmenuProps> = ({ page }) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  const publishMutation = useMutation(
    async () => {
      const response = await fetch("/api/page/publish", {
        method: "POST",
        body: JSON.stringify({ page }),
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      return json;
    },
    {
      onSuccess: () => {
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
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-2 rounded-xl bg-gray-100 p-2 px-4">
          <Share size={20} strokeWidth={1.5} />
          <span>Publish</span>
        </button>
      </Popover.Trigger>
      <Popover.Content
        className="w-[254px] rounded-xl bg-gray-100 p-4"
        align="end"
      >
        <p className="mb-2 text-sm text-gray-500">Publications</p>
        <div className="flex w-full flex-col gap-4">
          <button
            onClick={() => publishMutation.mutate()}
            className="rounded-xl bg-gradient-radial from-[#4B5563] to-[#1F2937] py-2 px-4 text-left text-white"
          >
            Publish to IPFS
          </button>
          {publicationsQuery.data?.map((publication) => {
            const url = `${getBaseUrl()}/p/${publication.id}`;

            return (
              <div className="flex w-full flex-col gap-3">
                <h3 className="text-sm text-gray-500">Latest publication</h3>
                <button
                  className={`flex items-center rounded-xl bg-gray-200 py-2 px-4 ${
                    isCopied ? "justify-center" : "justify-between"
                  }`}
                  onClick={() => copyToClipboard(url)}
                >
                  <span>{isCopied ? "Copied!" : "Copy Link"}</span>
                  {isCopied ? (
                    <AiOutlineCheck size={24} className="text-black" />
                  ) : (
                    <LinkIcon size={20} />
                  )}
                </button>
                <TwitterShareButton url={url} title={page.title} className="">
                  <div className="flex items-center justify-between rounded-xl bg-[#1DA1F2] py-2 px-4 text-white">
                    <span>Share to Twitter</span>
                    <TwitterIcon size={20} />
                  </div>
                </TwitterShareButton>
                <Link
                  className="flex items-center justify-between rounded-xl bg-[#ABFE2C] py-2 px-4 text-[#00501E] [&>svg>path]:fill-[#00501E]"
                  href={`https://lenster.xyz/?text=${encodeURIComponent(
                    page.title
                  )}&url=${url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share to Lens
                  <LensIcon />
                </Link>
              </div>
            );
          })}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};
