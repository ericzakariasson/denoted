import { Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { TallyComponent } from "./tally-component";

export const Tally = Node.create({
  name: "tallyComponent",

  group: "inline",

  inline: true,

  selectable: true,

  addAttributes() {
    return {
      query: {
        default: undefined,
      },
      path: {
        default: undefined,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "tally-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["tally-component", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(TallyComponent);
  },
});
