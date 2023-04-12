// ShareDialog.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Switch } from "@radix-ui/react-switch";
import { FiShare } from "react-icons/fi";

export const ShareDialog: React.FC = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [open, setOpen] = useState(false);

    const twitterShareUrl = () => {
      const text = encodeURIComponent('Check out this content!');
      const url = encodeURIComponent(window.location.href);
      const hashtags = encodeURIComponent('example');
      return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
    };

    const lensShareUrl = () => {
      console.log('lensShareUrl')
    }
    const onTwitterShare = () => {
      window.open(twitterShareUrl(), '_blank');
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button className="relative mr-4 mb-4 flex w-fit flex-row gap-2 rounded-lg bg-gray-100 p-2">
          <FiShare size={20} color={"#6B7280"} />{" "}
          <span className="text-[#6B7280]">Share</span>
        </button>
        <DialogContent className="absolute -translate-x-[53%] w-fit rounded-lg bg-gray-100 p-2">
        <div>
          <h3>Public / Private Access</h3>
          <Switch
            checked={isPublic}
            onCheckedChange={(checked) => setIsPublic(checked)}
          />
          <label>{isPublic ? "Public" : "Private"}</label>
        </div>
        <div>
          <h3>Share on</h3>
          <button onClick={() => console.log("Twitter")}>Twitter</button>
          <button onClick={() => console.log("lens")}>Lens</button>
        </div>
      </DialogContent>
      </DialogTrigger>
    </Dialog>
  );
};
