import { NodeViewWrapper } from "@tiptap/react";
import React from "react";
import { WalletBalanceWidget } from "../../../../components/widgets/Wallet";
import { useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { ethers } from "ethers";

const provider = new ethers.providers.InfuraProvider(
  "mainnet",
  process.env.INFURA_API_KEY
);

type WalletComponentProps = {
  updateAttributes: (attributes: Record<string, string>) => void;
  node: {
    attrs: {
      address: string | undefined;
      chain: string;
      symbol: string | undefined;
    };
  };
};

async function parseAddress(rawAddress: string) {
  if (rawAddress.endsWith(".ens")) {
    return (await provider.resolveName(rawAddress)) ?? "";
  }

  return rawAddress;
}

export const WalletComponent = (props: WalletComponentProps) => {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const x = formData.get("address")?.toString() ?? "";

    props.updateAttributes({
      address: await parseAddress(formData.get("address")?.toString() ?? ""),
      symbol: formData.get("symbol")?.toString() ?? "",
      chain: formData.get("chain")?.toString() ?? "",
    });
  }

  const address = props.node.attrs.address;
  const chain = Number(props.node.attrs.chain);
  const symbol = props.node.attrs.symbol;

  const isConfigured = address !== undefined && symbol !== undefined;

  return (
    <NodeViewWrapper as="span">
      <Popover.Root>
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
    </NodeViewWrapper>
  );
};
