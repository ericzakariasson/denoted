// ShareDialog.tsx
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { FiShare } from "react-icons/fi";
import { BiLink } from "react-icons/bi";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { ShareToLens, Theme, Size } from "@lens-protocol/widgets-react";

export const ShareDialog: React.FC = () => {
  return (
    <Dialog.Root>
      <div className="relative inline-block">
        <Dialog.Trigger className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
          <FiShare size={20} className="text-gray-400" />
          <span className="text-gray-400 font-medium">Share</span>
        </Dialog.Trigger>
        <Dialog.Content className="absolute right-0 mt-2 gap-8 rounded-lg bg-gray-100 py-4 px-3 w-[205px]">
          <h3 className="text-left text-gray-400 font-semibold">Share</h3>
          <div className="my-4 flex items-center justify-between">
            <Switch.Root
              className="h-[25px] w-[42px] cursor-default rounded-full bg-gray-200 focus:shadow-[0_0_0_2px_#E5E7EB] data-[state=checked]:bg-gray-500"
              id="public-access"
            >
              <Switch.Thumb className="shadow-blackA7 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <label className="pr-[15px] text-[15px] leading-none font-medium" htmlFor="public-access">
              Public Access
            </label>
          </div>
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4">
              <button className="flex flex-row justify-between items-center bg-gray-200 py-2 px-3 rounded-lg" onClick={() => console.log("lens")}>
                <span className="font-medium text-gray-400">Copy Link</span>
                <BiLink size={24} className="text-gray-400" />
              </button>
              <TwitterShareButton
                url={"https://facebook.com/saurabhnemade"}
                title={"#reactjs is awesome"}
                via={"saurabhnemade"}
              >
                <div className="flex w-full items-center justify-center bg-[#1DA1F2] py-2 px-3 text-white rounded-lg">
                <TwitterIcon size={24} round />
                <span className="ml-2 font-helvetica font-semibold">
                  Share to Twitter
                </span>
                </div>              </TwitterShareButton>
              <ShareToLens
                content="https://facebook.com/saurabhnemade"
                theme={Theme.mint}
                size={Size.medium}
                url={"https://facebook.com/saurabhnemade"}
              />
            </div>
          </div>
        </Dialog.Content>
      </div>
    </Dialog.Root>
  );
};
