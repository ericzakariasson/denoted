import { NodeViewWrapper } from "@tiptap/react";

import * as chains from "wagmi/chains";

import * as Popover from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { NetWorthWidget, NetWorthWidgetProps } from "./NetWorth";
import { Label } from "../../Label";

export const NetWorthConfig = (
  props: CommandExtensionProps<NetWorthWidgetProps>
) => {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    props.updateAttributes({
      address: formData.get("address")?.toString() ?? "",
      chain: Number(formData.get("chain")?.toString() ?? ""),
    });

    setOpen(false);

    props.editor.view.dom.focus();
  }

  const { address, chain } = props.node.attrs;

  const [isOpen, setOpen] = useState(false);

  const isConfigured = address !== undefined;

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <NetWorthWidget address={address} chain={Number(chain)} />
      )}
      {props.editor.isEditable && (
        <Popover.Root
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <Popover.Trigger>
            {isConfigured ? (
              <NetWorthWidget address={address} chain={Number(chain)} />
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
              className="s z-50 w-64 overflow-hidden rounded-2xl bg-gray-100 p-4 outline-none"
            >
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-start gap-4"
                name="wallet-setup"
              >
                <Label label="Address">
                  <input
                    name="address"
                    placeholder="erci.eth or 0x"
                    defaultValue={address ?? ""}
                    className="rounded-lg bg-gray-200 px-3 py-2"
                    required
                  />
                </Label>
                <Label label="Chain">
                  <select
                    name="chain"
                    defaultValue={chain ?? ""}
                    className="rounded-lg border-none bg-gray-200"
                  >
                    {Object.values(chains)
                      .filter(
                        (chain) =>
                          chain.network !== "localhost" &&
                          chain.network !== "hardhat"
                      )
                      .map((chain) => (
                        <option key={chain.id} value={chain.id}>
                          {chain.name}
                        </option>
                      ))}
                  </select>
                </Label>
                <button
                  type="submit"
                  className="rounded-full border border-black px-2 py-0 text-black"
                >
                  save
                </button>
              </form>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </NodeViewWrapper>
  );
};
