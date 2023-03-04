import { NodeViewWrapper } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import React from "react";
import { WalletBalanceWidget } from "../../../../components/widgets/Balance";

import * as Popover from "@radix-ui/react-popover";
import { getEnsAddress } from "../../../../utils/ens";
import { useState, useEffect } from "react";

type BalanceComponentProps = {
  updateAttributes: (attributes: Record<string, string>) => void;
  node: {
    attrs: {
      address: string | undefined;
      chain: string;
      symbol: string | undefined;
    };
  };
  editor: Editor;
};

async function parseAddress(rawAddress: string) {
  if (rawAddress.endsWith(".ens")) {
    return (await getEnsAddress(rawAddress)) ?? "";
  }

  return rawAddress;
}

export const BalanceComponent = (props: BalanceComponentProps) => {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    props.updateAttributes({
      address: await parseAddress(formData.get("address")?.toString() ?? ""),
      symbol: formData.get("symbol")?.toString() ?? "",
      chain: formData.get("chain")?.toString() ?? "",
    });

    setOpen(false);
  }

  const address = props.node.attrs.address;
  const chain = Number(props.node.attrs.chain);
  const symbol = props.node.attrs.symbol;

  const [isOpen, setOpen] = useState(false);

  const isConfigured = address !== undefined && symbol !== undefined;

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <WalletBalanceWidget address={address} chain={chain} symbol={symbol} />
      )}
      {props.editor.isEditable && (
        <Popover.Root
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <Popover.Trigger>
            {isConfigured ? (
              <WalletBalanceWidget
                address={address}
                chain={chain}
                symbol={symbol}
              />
            ) : (
              <span className="rounded-full border border-gray-300 py-0 px-1 leading-normal text-gray-500">
                setup
              </span>
            )}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={5}
              align="start"
              className="s z-50 w-72 rounded-md border border-black bg-white p-4 outline-none dark:border-slate-800 dark:bg-slate-800"
            >
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2"
                name="wallet-setup"
              >
                <input
                  name="address"
                  placeholder={"erci.eth"}
                  defaultValue={address ?? ""}
                />
                <select name="symbol" defaultValue={symbol}>
                  {["eth", "usdc", "op"].map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol.toUpperCase()}
                    </option>
                  ))}
                </select>
                <input name="chain" type="number" defaultValue={chain} />
                <button type="submit">save</button>
              </form>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </NodeViewWrapper>
  );
};
