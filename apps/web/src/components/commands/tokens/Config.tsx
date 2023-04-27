import { NodeViewWrapper } from "@tiptap/react";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Popover } from "../../ui/popover";
import { useBlockConfigProps } from "../../use-block-config-props";
import { BlockConfigButton, BlockConfigForm } from "../BlockConfig";
import { TokenWidget, TokenWidgetProps } from "./Tokens";

export const TokenPriceConfig = (
  props: CommandExtensionProps<TokenWidgetProps>
) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useBlockConfigProps(props);

  const { property, chainId, token } = props.node.attrs;

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <TokenWidget property={property} chainId={chainId} token={token} />
      )}
      {props.editor.isEditable && (
        <Popover
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <BlockConfigButton isConfigured={isConfigured}>
            <TokenWidget property={property} chainId={chainId} token={token} />
          </BlockConfigButton>

          <BlockConfigForm
            fields={[
              {
                name: "token",
                label: "Token",
                type: "text",
                placeholder: "E.g. ETH, USDC, USDT, etc.",
                defaultValue: token,
              },
              {
                name: "chainId",
                type: "chain",
                defaultValue: chainId?.toString(),
              },
            ]}
            onSubmit={onSubmit}
          />
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
