import { Extension } from "@tiptap/core";
import { Node, NodeType } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "prosemirror-state";

// based on https://github.com/ueberdosis/tiptap/blob/40a9404c94c7fef7900610c195536384781ae101/demos/src/Experiments/TrailingNode/Vue/trailing-node.ts

/**
 * Extension based on:
 * - https://github.com/ueberdosis/tiptap/blob/v1/packages/tiptap-extensions/src/extensions/TrailingNode.js
 * - https://github.com/remirror/remirror/blob/e0f1bec4a1e8073ce8f5500d62193e52321155b9/packages/prosemirror-trailing-node/src/trailing-node-plugin.ts
 */

export interface TrailingNodeOptions {
  node: string;
}

/**
 * Add a trailing node to the document so the user can always click at the bottom of the document and start typing
 */
export const TrailingNode = Extension.create<TrailingNodeOptions>({
  name: "trailingNode",

  addOptions() {
    return {
      node: "paragraph",
    };
  },

  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name);

    return [
      new Plugin({
        key: plugin,
        appendTransaction: (_, __, state) => {
          const { doc, tr, schema } = state;
          const shouldInsertNodeAtEnd = plugin.getState(state);
          const endPosition = doc.content.size;
          const type = schema.nodes[this.options.node];

          if (!shouldInsertNodeAtEnd) {
            return;
          }

          return tr.insert(endPosition, type.create());
        },
        state: {
          init: (_, state) => {},
          apply: (tr, value) => {
            if (!tr.docChanged) {
              return value;
            }

            const lastNode = tr.doc.lastChild;

            // if the last node has content we allow the trailing node to be inserted
            return lastNode?.lastChild?.nodeSize ?? 0 > 0;
          },
        },
      }),
    ];
  },
});
