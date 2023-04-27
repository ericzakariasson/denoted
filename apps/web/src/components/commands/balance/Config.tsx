import { NodeViewWrapper } from "@tiptap/react";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Popover } from "../../ui/popover";
import { useBlockConfigProps } from "../../use-command-extension-config";
import { BlockConfigButton, BlockConfigForm } from "../BlockConfig";
import { WalletBalanceWidget, WalletBalanceWidgetProps } from "./Balance";

export const WalletBalanceWidgetConfig = (
  props: CommandExtensionProps<WalletBalanceWidgetProps>
) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useBlockConfigProps(props);

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
          <BlockConfigButton isConfigured={isConfigured}>
            <WalletBalanceWidget
              address={address}
              chain={Number(chain)}
              symbol={symbol}
            />
          </BlockConfigButton>
          <BlockConfigForm
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
                options: ["eth", "usdc", "op", "spork"].map((symbol) =>
                  symbol.toUpperCase()
                ),
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
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
