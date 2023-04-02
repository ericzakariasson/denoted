import { JSONContent } from "@tiptap/react";
export type PageNode = {
  content: string;
  type: string;
  attrs?: string;
  marks?: string;
};

export function serializePageNode(node: JSONContent): PageNode {
  return {
    type: node.type!,
    content: JSON.stringify(node.content),
    attrs: node.attrs ? JSON.stringify(node.attrs) : undefined,
    marks: node.marks ? JSON.stringify(node.marks) : node.marks,
  };
}

export function parsePageNode(pageNode: PageNode): JSONContent {
  return {
    type: pageNode.type,
    content: JSON.parse(pageNode.content),
    attrs: pageNode.attrs ? JSON.parse(pageNode.attrs) : undefined,
    marks: pageNode.marks ? JSON.parse(pageNode.marks) : pageNode.marks,
  };
}
