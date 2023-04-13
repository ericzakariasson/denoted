// ShareDialog.tsx
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { FiShare } from "react-icons/fi";
import { BiLink } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { ShareToLens, Theme, Size } from "@lens-protocol/widgets-react";
export type ShareDialogProps = {
  title: string;
  content: string;
};

export const ShareDialog: React.FC<ShareDialogProps> = ({ title, content }) => {
  const [uniqueURL, setUniqueURL] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uniqueURL);
    setIsCopied(true);
  };
  useEffect(() => {
    setPageTitle(title);
    setPageContent(content);
    setUniqueURL(window.location.href);
  }, [content, title, uniqueURL]);

  return (
    <Dialog.Root>
      <div className="relative inline-block">
        <Dialog.Trigger className="flex items-center gap-2 rounded-lg bg-gray-100 p-2">
          <FiShare size={20} className="text-gray-400" />
          <span className="font-medium text-gray-400">Share</span>
        </Dialog.Trigger>
        <Dialog.Content className="absolute right-0 mt-2 w-[205px] gap-8 rounded-lg bg-gray-100 py-4 px-3">
          <h3 className="text-left font-semibold text-gray-400">Share</h3>
          <div className="my-4 flex items-center justify-between">
            <Switch.Root
              className="h-[25px] w-[42px] cursor-default rounded-full bg-gray-200 focus:shadow-[0_0_0_2px_#E5E7EB] data-[state=checked]:bg-gray-500"
              id="public-access"
            >
              <Switch.Thumb className="shadow-blackA7 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <label
              className="pr-[15px] text-[15px] font-medium leading-none"
              htmlFor="public-access"
            >
              Public Access
            </label>
          </div>
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4">
              <button
                className={`flex rounded-lg py-2 px-3 flex-row items-center bg-gray-200 ${isCopied ? `justify-center` : `justify-between`}`}
                onClick={copyToClipboard}
              >
                {isCopied ? (
                  <>
                    <span className="font-medium text-black-400">Copied!</span>
                    <AiOutlineCheck size={24} className="text-black-400" />
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-400">Copy Link</span>
                    <BiLink size={24} className="text-gray-400" />
                  </>
                )}
              </button>
              <TwitterShareButton
                url={uniqueURL}
                title={pageTitle}
                hashtags={["denoted,denotedxyz"]}
              >
                <div className="flex w-full items-center justify-center rounded-lg bg-[#1DA1F2] py-2 px-3 text-white">
                  <TwitterIcon size={24} round />
                  <span className="font-helvetica ml-2 font-semibold">
                    Share to Twitter
                  </span>
                </div>
              </TwitterShareButton>
              <ShareToLens
                title={pageTitle}
                content={pageContent}
                theme={Theme.mint}
                size={Size.medium}
                url={uniqueURL}
              />
            </div>
          </div>
        </Dialog.Content>
      </div>
    </Dialog.Root>
  );
};
