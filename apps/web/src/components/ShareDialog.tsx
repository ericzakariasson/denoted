// ShareDialog.tsx
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { FiShare } from "react-icons/fi";
import { BiLink } from "react-icons/bi";
import { TwitterShareButton } from "react-twitter-embed";
import { ShareToLens, Theme, Size } from "@lens-protocol/widgets-react";

export const ShareDialog: React.FC = () => {
  return (
    <Dialog.Root>
      <div>
        <Dialog.Trigger>
          <button className="relative mr-4 mb-4 flex w-fit flex-row gap-2 rounded-lg bg-gray-100 p-2">
            <FiShare size={20} color={"#6B7280"} />
            <span className="text-[#6B7280]">Share</span>
          </button>
        </Dialog.Trigger>
        <Dialog.Content className="absolute -translate-x-[52%] gap-8 rounded-lg bg-gray-100 py-4 px-3">
          <h3 className="text-left text-gray-400">Share</h3>
          <div
            className="my-3 flex items-center gap-1"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Switch.Root className="h-[25px] w-[42px] cursor-default rounded-full focus:shadow-[0_0_0_2px]">
              <Switch.Thumb className="shadow-blackA7 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <label className="pr-[15px] text-[15px] leading-none">
              Public Access
            </label>
          </div>
          <div className="mt-4 flex flex-col items-center gap-4">
            <button className="bg-gray-200 w-full flex flex-row justify-between py-2 px-3 rounded-lg" onClick={() => console.log("lens")}>
              Copy Link <BiLink size={24} color={"#6B7280"} />
            </button>
            <TwitterShareButton
              url={"https://facebook.com/saurabhnemade"}
              options={{
                text: "#reactjs is awesome",
                via: "saurabhnemade",
                size: "large",
              }}
            />
            <ShareToLens
              content={"Hello World"}
              size={Size.medium}
              theme={Theme.mint}
            />
          </div>
        </Dialog.Content>
      </div>
    </Dialog.Root>
  );
};
