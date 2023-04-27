import { NodeViewWrapper } from "@tiptap/react";

import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Popover } from "../../ui/popover";
import { useBlockConfigProps } from "../../use-command-extension-config";
import { BlockConfigButton, BlockConfigForm } from "../BlockConfig";
import { TransactionWidget, TransactionWidgetProps } from "./Transaction";

export const TransactionConfig = (
  props: CommandExtensionProps<TransactionWidgetProps>
) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useBlockConfigProps(props);

  const { txHash, chain } = props.node.attrs;

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <TransactionWidget txHash={txHash} chain={Number(chain)} />
      )}
      {props.editor.isEditable && (
        <Popover
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <BlockConfigButton isConfigured={isConfigured}>
            <TransactionWidget txHash={txHash} chain={Number(chain)} />
          </BlockConfigButton>

          <BlockConfigForm
            fields={[
              {
                name: "txHash",
                type: "text",
                defaultValue: txHash,
                label: "Transaction Hash",
                placeholder: "0x123...456",
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
