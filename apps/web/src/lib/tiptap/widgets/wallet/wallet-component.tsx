import { NodeViewWrapper } from "@tiptap/react";
import React from "react";
import { WalletBalanceWidget } from "../../../../components/widgets/Wallet";

type WalletComponentProps = {
  updateAttributes: any;
  node: any;
};

export const WalletComponent = (props: WalletComponentProps) => {
  return (
    <NodeViewWrapper>
      <WalletBalanceWidget
        address="0x9768cead8f28bd7aA5e095D4402B8911b8484e7E"
        chain={1}
      />
    </NodeViewWrapper>
  );
};
