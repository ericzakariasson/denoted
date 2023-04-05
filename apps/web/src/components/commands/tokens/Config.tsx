import { NodeViewWrapper } from "@tiptap/react";
import React, { useEffect, useMemo, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import * as chains from "wagmi/chains";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { TokenWidget, TokenWidgetProps } from "./Tokens";
import { Label } from "../../Label";

export const TokenPriceConfig = (
  props: CommandExtensionProps<TokenWidgetProps>
) => {
  const [isOpen, setOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    props.updateAttributes({
      chainName: formData.get("chainName")?.toString() ?? undefined,
      token: formData.get("token")?.toString() ?? undefined
    });

    setOpen(false);

    props.editor.view.dom.focus();
  }

  const { property, chainName, token, platforms } = props.node.attrs;

  const isConfigured =
    property !== undefined &&
    chainName !== undefined &&
    token !== undefined &&
    platforms !== undefined;

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <TokenWidget
          property={property}
          chainName={chainName.toLowerCase()}
          token={token}
          platforms={platforms}
        />
      )}
      {props.editor.isEditable && (
        <Popover.Root
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <Popover.Trigger>
            {isConfigured ? (
              <TokenWidget
                property={property}
                chainName={chainName.toLowerCase()}
                token={token}
                platforms={platforms}
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
              className="s z-50 w-64 overflow-hidden rounded-2xl bg-gray-100 p-4 outline-none"
            >
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-start gap-4"
                name="graph-setup"
              >
                <Label label="Token">
                  <input
                    name="token"
                    placeholder="E.g. ETH, USDC, USDT, etc."
                    className="rounded-lg bg-gray-200 px-3 py-2"
                    defaultValue={token}
                    required
                  />
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
