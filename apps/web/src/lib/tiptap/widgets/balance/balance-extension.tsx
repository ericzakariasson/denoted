import { Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { BalanceComponent } from "./balance-component";

export const Balance = Node.create({
  name: "balanceComponent",

  group: "inline",

  inline: true,

  selectable: true,

  addAttributes() {
    return {
      address: {
        default: undefined,
      },
      symbol: {
        default: undefined,
      },
      chain: {
        default: 1,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "balance-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["balance-component", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(BalanceComponent);
  },
});
