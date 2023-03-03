import { Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { GraphComponent } from "./graph-component";

export const Graph = Node.create({
  name: "graphComponent",

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
        tag: "graph-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["graph-component", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(GraphComponent);
  },
});
