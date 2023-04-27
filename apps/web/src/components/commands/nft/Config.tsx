import { NodeViewWrapper } from "@tiptap/react";

import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Popover } from "../../ui/popover";
import { useBlockConfigProps } from "../../use-block-config-props";
import { BlockConfigButton, BlockConfigForm } from "../BlockConfig";
import { FormField } from "../ConfigForm";
import { NftWidget, NftWidgetProps } from "./Nft";

export const NftConfig = (props: CommandExtensionProps<NftWidgetProps>) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useBlockConfigProps(props);

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
          <BlockConfigButton isConfigured={isConfigured}>
            <NftWidget
              property={property}
              address={address}
              chain={chain}
              tokenId={tokenId}
            />
          </BlockConfigButton>

          <BlockConfigForm
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
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
