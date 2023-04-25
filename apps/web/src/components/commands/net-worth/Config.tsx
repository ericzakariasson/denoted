import { NodeViewWrapper } from "@tiptap/react";

import * as chains from "wagmi/chains";

import { useEffect, useState } from "react";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { NetWorthWidget, NetWorthWidgetProps } from "./NetWorth";
import { Label } from "../../Label";
import { useCommandExtensionConfig } from "../../use-command-extension-config";
import { ConfigForm } from "../ConfigForm";
import { Badge } from "../../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

export const NetWorthConfig = (
  props: CommandExtensionProps<NetWorthWidgetProps>
) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useCommandExtensionConfig(props);

  const { address, chain } = props.node.attrs;

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <NetWorthWidget address={address} chain={Number(chain)} />
      )}
      {props.editor.isEditable && (
        <Popover
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <PopoverTrigger>
            {isConfigured ? (
              <NetWorthWidget address={address} chain={Number(chain)} />
            ) : (
              <Badge variant={"outline"}>setup</Badge>
            )}
          </PopoverTrigger>
          <PopoverContent align="start">
            <ConfigForm
              fields={[
                {
                  name: "address",
                  type: "address",
                  defaultValue: address,
                },
                {
                  name: "chain",
                  type: "chain",
                  defaultValue: chain.toString(),
                },
              ]}
              onSubmit={onSubmit}
            />
          </PopoverContent>
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
