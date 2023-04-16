import React, { useState, useEffect, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { getPageQuery } from "../composedb/page";
import { FiShare } from "react-icons/fi";
import { BiLink } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { ShareToLens, Theme, Size } from "@lens-protocol/widgets-react";
import { useRouter } from "next/router";
import { getBaseUrl } from "../utils/base-url";

export type PublishmenuProps = {
  title: string;
};

export const PublishMenu: React.FC<PublishmenuProps> = ({ title }) => {
  const { asPath } = useRouter();

  const [isCopied, setIsCopied] = useState(false);
  //TODO: add logic for isPublished on IPFS
  const [isPublished, setIsPublished] = useState(false);
  const uniqueURL = getBaseUrl() + asPath
  const copyToClipboard = () => {
    navigator.clipboard.writeText(uniqueURL);
    setIsCopied(true);
  };

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
      <Popover.Content className="mt-2 w-[254px] rounded-lg bg-gray-100 py-4 px-3" align="end">
        <h3 className="text-sm font-semibold text-gray-400">Publications</h3>

        <div className="mt-4 flex w-full flex-col gap-4">
          {isPublished ? (
            <>
              <button className="rounded-lg bg-gradient-radial from-[#4B5563] to-[#1F2937] py-2 px-3 text-left text-white">
                Publish New Version
              </button>
              <div className="flex w-full flex-col gap-4 rounded-lg border-2 border-gray-200 p-3 font-semibold">
                <h3 className="text-sm text-gray-500">VERSION 1</h3>
                <button
                  className={`flex items-center rounded-lg bg-gray-200 py-2 px-3 ${
                    isCopied ? "justify-center" : "justify-between"
                  }`}
                  onClick={copyToClipboard}
                >
                  <span className="text-black font-medium">
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
                  title={title}
                  hashtags={["denoted,denotedxyz"]}
                >
                  <div className="flex items-center rounded-lg bg-[#1DA1F2] py-2 px-3 text-white">
                    <TwitterIcon size={24} round />
                    <span className="font-helvetica ml-2 font-semibold">
                      Share to Twitter
                    </span>
                  </div>
                </TwitterShareButton>
                <ShareToLens
                  title={"Share to Lens"}
                  content={title}
                  theme={Theme.mint}
                  size={Size.medium}
                  url={uniqueURL}
                />
              </div>
            </>
          ) : (
            <>
              <button className="rounded-lg bg-gradient-radial from-[#4B5563] to-[#1F2937] py-2 px-3 text-left text-white">
                Publish to IPFS
              </button>
            </>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};
