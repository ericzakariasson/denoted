import { NodeViewWrapper } from "@tiptap/react";

import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Badge } from "../../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useCommandExtensionConfig } from "../../use-command-extension-config";
import { ConfigForm, FormField } from "../ConfigForm";
import { NftWidget, NftWidgetProps } from "./Nft";

export const NftConfig = (props: CommandExtensionProps<NftWidgetProps>) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useCommandExtensionConfig(props);

  const { property, address, chain, tokenId } = props.node.attrs;

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <NftWidget property={property} address={address} chain={chain} />
      )}
      {props.editor.isEditable && (
        <Popover
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <PopoverTrigger>
            {isConfigured ? (
              <NftWidget
                property={property}
                address={address}
                chain={chain}
                tokenId={tokenId}
              />
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
                property === "image"
                  ? ({
                      name: "tokenId",
                      type: "text",
                      defaultValue: tokenId?.toString(),
                      placeholder: "1337",
                      label: "Token Id",
                    } as FormField)
                  : null,
                {
                  name: "chain",
                  type: "chain",
                  defaultValue: chain.toString(),
                },
              ].filter((field): field is FormField => field !== null)}
              onSubmit={onSubmit}
            />
          </PopoverContent>
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
