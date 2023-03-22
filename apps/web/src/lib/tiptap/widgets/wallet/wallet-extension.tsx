import { Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { WalletComponent } from "./wallet-component";

export const Wallet = Node.create({
  name: "walletComponent",

  group: "inline",

  inline: true,

  selectable: true,

  parseHTML() {
    return [
      {
        tag: "Wallet-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["wallet-component", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(WalletComponent);
  },
});
