import { Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { LensComponent } from "./lens-component";

export const Lens = Node.create({
  name: "lensComponent",

  group: "inline",

  inline: true,

  selectable: true,

  addAttributes() {
    return {
      handle: {
        default: undefined,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "lens-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["lens-component", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(LensComponent);
  },
});
