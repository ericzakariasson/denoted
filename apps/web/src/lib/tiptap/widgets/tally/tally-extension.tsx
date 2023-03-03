import { Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { TallyComponent } from "./tally-component";

export const Graph = Node.create({
  name: "tallyComponent",

  group: "inline",

  inline: true,

  selectable: true,

  addAttributes() {
    return {
      url: {
        default: undefined,
      },
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
