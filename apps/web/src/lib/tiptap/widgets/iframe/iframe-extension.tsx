import { Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { IframeComponent } from "./iframe-component";

export const Iframe = Node.create({
  name: "iframe",

  group: "block",
  selectable: false,

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["iframe-component", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(IframeComponent);
  },
});
