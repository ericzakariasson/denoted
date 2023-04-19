import { ShareToLens, Size, Theme } from "@lens-protocol/widgets-react";
import * as Popover from "@radix-ui/react-popover";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { BiLink } from "react-icons/bi";
import { FiShare } from "react-icons/fi";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { getBaseUrl } from "../utils/base-url";
import { useMutation, useQuery } from "react-query";
import { DeserializedPage } from "../utils/page-helper";
import { Database } from "../lib/supabase/supabase.types";

export type PublishmenuProps = {
  page: DeserializedPage;
};

export const PublishMenu: React.FC<PublishmenuProps> = ({ page }) => {
  const { asPath } = useRouter();

  const [isCopied, setIsCopied] = useState(false);
  const uniqueURL = getBaseUrl() + asPath;
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
      <Popover.Trigger
        asChild
        className="flex h-fit items-center gap-2 rounded-lg bg-gray-100 p-2"
      >
        <button>
          <FiShare size={20} className="text-gray-400" />
          <span className="font-medium text-gray-400">Publish</span>
        </button>
      </Popover.Trigger>
      <Popover.Content
        className="mt-2 w-[254px] rounded-lg bg-gray-100 py-4 px-3"
        align="end"
      >
        <h3 className="text-sm font-semibold text-gray-400">Publications</h3>

        <div className="mt-4 flex w-full flex-col gap-4">
          <button
            onClick={() => publishMutation.mutate()}
            className="rounded-lg bg-gradient-radial from-[#4B5563] to-[#1F2937] py-2 px-3 text-left text-white"
          >
            Publish to IPFS
          </button>
          {publicationsQuery.data?.map((publication) => {
            return (
              <div className="flex w-full flex-col gap-4 rounded-lg border-2 border-gray-200 p-3 font-semibold">
                <h3 className="text-sm text-gray-500">Latest publication</h3>
                <button
                  className={`flex items-center rounded-lg bg-gray-200 py-2 px-3 ${
                    isCopied ? "justify-center" : "justify-between"
                  }`}
                  onClick={() =>
                    copyToClipboard(`${getBaseUrl()}/p/${publication.id}`)
                  }
                >
                  <span className="font-medium text-black">
                    {isCopied ? "Copied!" : "Copy Link"}
                  </span>
                  {isCopied ? (
                    <AiOutlineCheck size={24} className="text-black" />
                  ) : (
                    <BiLink size={24} className="text-black" />
                  )}
                </button>
                <TwitterShareButton
                  url={uniqueURL}
                  title={page.title}
                  hashtags={["denoted,denotedxyz"]}
                >
                  <div className="flex items-center rounded-lg bg-[#1DA1F2] py-2 px-3 text-white">
                    <TwitterIcon size={24} round />
                    <span className="ml-2 font-semibold">Share to Twitter</span>
                  </div>
                </TwitterShareButton>
                <ShareToLens
                  title={"Share to Lens"}
                  content={page.title}
                  theme={Theme.mint}
                  size={Size.medium}
                  url={uniqueURL}
                />
              </div>
            );
          })}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};
