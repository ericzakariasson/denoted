import { NodeViewWrapper } from "@tiptap/react";

import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Badge } from "../../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useCommandExtensionConfig } from "../../use-command-extension-config";
import { ConfigForm } from "../ConfigForm";
import { TransactionWidget, TransactionWidgetProps } from "./Transaction";

export const TransactionConfig = (
  props: CommandExtensionProps<TransactionWidgetProps>
) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useCommandExtensionConfig(props);

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
          <PopoverTrigger>
            {isConfigured ? (
              <TransactionWidget txHash={txHash} chain={Number(chain)} />
            ) : (
              <Badge variant={"outline"}>setup</Badge>
            )}
          </PopoverTrigger>

          <PopoverContent align="start">
            <ConfigForm
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
          </PopoverContent>
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
