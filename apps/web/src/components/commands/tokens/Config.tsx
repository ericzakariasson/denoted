import { NodeViewWrapper } from "@tiptap/react";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Badge } from "../../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useCommandExtensionConfig } from "../../use-command-extension-config";
import { ConfigForm } from "../ConfigForm";
import { TokenWidget, TokenWidgetProps } from "./Tokens";

export const TokenPriceConfig = (
  props: CommandExtensionProps<TokenWidgetProps>
) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useCommandExtensionConfig(props);

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
          <PopoverTrigger>
            {isConfigured ? (
              <TokenWidget
                property={property}
                chainId={chainId}
                token={token}
              />
            ) : (
              <Badge variant={"outline"}>setup</Badge>
            )}
          </PopoverTrigger>

          <PopoverContent align="start">
            <ConfigForm
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
          </PopoverContent>
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
