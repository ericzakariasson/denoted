import { NodeViewWrapper } from "@tiptap/react";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Badge } from "../../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useCommandExtensionConfig } from "../../use-command-extension-config";
import { ConfigForm } from "../ConfigForm";
import { WalletBalanceWidget, WalletBalanceWidgetProps } from "./Balance";

export const WalletBalanceWidgetConfig = (
  props: CommandExtensionProps<WalletBalanceWidgetProps>
) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useCommandExtensionConfig(props);

  const { address, chain, symbol } = props.node.attrs;

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <WalletBalanceWidget
          address={address}
          chain={Number(chain)}
          symbol={symbol}
        />
      )}
      {props.editor.isEditable && (
        <Popover
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <PopoverTrigger>
            {isConfigured ? (
              <WalletBalanceWidget
                address={address}
                chain={Number(chain)}
                symbol={symbol}
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
                {
                  name: "symbol",
                  label: "Ticker Symbol",
                  type: "select",
                  options: ["eth", "usdc", "op", "spork"],
                  defaultValue: symbol,
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
