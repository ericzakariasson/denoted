import { NodeViewWrapper } from "@tiptap/react";
import React from "react";
import { WalletBalanceWidget } from "../../../../components/widgets/Wallet";
import { useState } from "react";

import * as Popover from "@radix-ui/react-popover";

type WalletComponentProps = {
  updateAttributes: any;
  node: any;
};

export const WalletComponent = (props: WalletComponentProps) => {
  const [address, setAddress] = useState<string>(
    "0x9768cead8f28bd7aA5e095D4402B8911b8484e7E"
  );
  const [chain, setChain] = useState(1);

  return (
    <NodeViewWrapper as="span">
      <Popover.Root>
        <Popover.Trigger>
          <WalletBalanceWidget address={address} chain={chain} />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={5}
            className="data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2 s z-50 w-72 rounded-md border border-black bg-white p-4 outline-none dark:border-slate-800 dark:bg-slate-800"
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                setAddress(formData.get("address")?.toString() ?? "");
                setChain(Number(formData.get("chain")?.toString()));
              }}
              className="flex flex-col gap-2"
            >
              <input
                name="address"
                placeholder={"0xdbe2aff176d2896858f0e34f0a652bf9f4bf0848"}
                defaultValue={address}
              />
              <input name="chain" type="number" defaultValue={chain} />
              <button type="submit">save</button>
            </form>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </NodeViewWrapper>
  );
};
