import { NodeViewWrapper } from "@tiptap/react";

import * as chains from "wagmi/chains";

import * as Popover from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { TransactionWidget, TransactionWidgetProps } from "./Transaction";
import { Label } from "../../Label";

export const TransactionConfig = (
  props: CommandExtensionProps<TransactionWidgetProps>
) => {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    props.updateAttributes({
      txHash: formData.get("txHash")?.toString() ?? "",
      chain: Number(formData.get("chain")?.toString() ?? ""),
    });

    setOpen(false);

    props.editor.view.dom.focus();
  }

  const { txHash, chain } = props.node.attrs;

  const [isOpen, setOpen] = useState(false);

  const isConfigured = txHash !== undefined;

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <TransactionWidget txHash={txHash} chain={Number(chain)} />
      )}
      {props.editor.isEditable && (
        <Popover.Root
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <Popover.Trigger>
            {isConfigured ? (
              <TransactionWidget txHash={txHash} chain={Number(chain)} />
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
                name="transaction-setup"
              >
                <Label label="Transaction hash">
                  <input
                    name="txHash"
                    placeholder="0x4ca7..."
                    defaultValue={txHash ?? ""}
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
                          !chain.testnet &&
                          chain.network !== "foundry" &&
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
