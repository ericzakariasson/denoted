import { NodeViewWrapper } from "@tiptap/react";

import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Popover } from "../../ui/popover";
import { useBlockConfigProps } from "../../use-command-extension-config";
import { BlockConfigButton, BlockConfigForm } from "../BlockConfig";
import { NetWorthWidget, NetWorthWidgetProps } from "./NetWorth";

export const NetWorthConfig = (
  props: CommandExtensionProps<NetWorthWidgetProps>
) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useBlockConfigProps(props);

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
          <BlockConfigButton isConfigured={isConfigured}>
            <NetWorthWidget address={address} chain={Number(chain)} />
          </BlockConfigButton>
          <BlockConfigForm
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
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
