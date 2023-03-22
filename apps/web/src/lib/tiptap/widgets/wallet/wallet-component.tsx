import { NodeViewWrapper } from "@tiptap/react";

import { WalletWidget } from "../../../../components/commands/wallet/Wallet";

export const WalletComponent = () => {
  return (
    <NodeViewWrapper as="span">
      <WalletWidget
        component="balance"
        props={{
          address: "",
          chain: 1,
          symbol: "",
        }}
      />
    </NodeViewWrapper>
  );
};
