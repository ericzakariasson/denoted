import { Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { BalanceComponent } from "./net-worth-component";

export const NetWorth = Node.create({
  name: "netWorthComponent",

  group: "inline",

  inline: true,

  selectable: true,

  addAttributes() {
    return {
      address: {
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
        tag: "net-worth-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["net-worth-component", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(BalanceComponent);
  },
});
