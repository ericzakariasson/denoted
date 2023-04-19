import { nodeInputRule, Node } from "@tiptap/core";
import { mergeAttributes, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { CommandExtensionProps } from "./types";
import { CommandConfiguration } from "../../components/commands/types";

export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export type IpfsImageProps = {
  src: string;
  cid: string;
};

export const IpfsImage = (
  props: CommandExtensionProps<IpfsImageProps>
) => {
  console.log(props.node.attrs);
  return (
    <NodeViewWrapper as="span">
      {props.node.attrs.cid}
    </NodeViewWrapper>
  );
};

export const command: CommandConfiguration<IpfsImageProps> = {
  command: 'ipfs-image',
  title: 'IPFS Image',
  icon: null,
  // editor
  blockType: "inline",
  defaultValues: {
    src: undefined,
    cid: undefined,
  },
  // component
  ConfigComponent: IpfsImage,
}

export const extension = Node.create({
    name: 'ipfs-image',

    addOptions() {
      return {
        inline: false,
        allowBase64: false,
        HTMLAttributes: {},
      }
    },
  
    inline() {
      return this.options.inline;
    },
  
    group() {
      return this.options.inline ? 'inline' : 'block';
    },
  
    draggable: true,
  
    addAttributes() {
      return {
        cid: {
          default: null,
        },
        src: {
          default: null,
        },
        alt: {
          default: null,
        },
        title: {
          default: null,
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'image',
        },
      ];
    },
  
    renderHTML({ HTMLAttributes }) {
      return ['image', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },
  
    addNodeView() {
      return ReactNodeViewRenderer(IpfsImage);
    },
  
    addInputRules() {
      return [
        nodeInputRule({
          find: inputRegex,
          type: this.type,
          getAttributes: match => {
            const [,, alt, src, title] = match;
            return { src, alt, title };
          },
        }),
      ]
    },
  });
