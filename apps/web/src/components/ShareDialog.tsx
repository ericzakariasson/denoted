// ShareDialog.tsx
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import * as Switch from "@radix-ui/react-switch";

import { FiShare } from "react-icons/fi";
import { BiLink } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { ShareToLens, Theme, Size } from "@lens-protocol/widgets-react";
import { JSONContent } from "@tiptap/react";

export type ShareDialogProps = {
  title: string;
  content: JSONContent[];
};

export const ShareDialog: React.FC<ShareDialogProps> = ({ title }) => {
  const [uniqueURL, setUniqueURL] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uniqueURL);
    setIsCopied(true);
  };
  useEffect(() => {
    setUniqueURL(window.location.href);
  }, [title, uniqueURL]);

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
    <Popover.Content className="mt-2 w-[254px] rounded-lg bg-gray-100 py-4 px-3">
      <h3 className="text-sm font-semibold text-gray-400">Publications</h3>
  
      <div className="flex flex-col gap-4 mt-4 w-full">
        <button className="text-left text-white bg-gradient-radial from-[#4B5563] to-[#1F2937] py-2 px-3 rounded-lg">
          Publish New Version
        </button>
  
        <div className="flex flex-col gap-4 w-full border-2 border-gray-200 rounded-lg p-3 font-semibold">
          <h3 className="text-gray-500 text-sm">VERSION 1</h3>
          <button
            className={`flex items-center rounded-lg bg-gray-200 py-2 px-3 ${
              isCopied ? "justify-center" : "justify-between"
            }`}
            onClick={copyToClipboard}
          >
            <span className="text-black-400 font-medium">{isCopied ? "Copied!" : "Copy Link"}</span>
            {isCopied ? (
              <AiOutlineCheck size={24} className="text-black-400" />
            ) : (
              <BiLink size={24} className="text-black-400" />
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
      </div>
    </Popover.Content>
  </Popover.Root>
  
  );
};
