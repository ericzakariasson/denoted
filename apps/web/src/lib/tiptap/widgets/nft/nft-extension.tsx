import { Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { NftComponent } from "./nft-component";

export const Nft = Node.create({
  name: "nftComponent",

  group: "inline",

  inline: true,

  selectable: true,

  addAttributes() {
    return {
      property: {
        default: undefined,
      },
      address: {
        default: undefined,
      },
      chain: {
        default: undefined,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "nft-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["nft-component", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(NftComponent);
  },
});
