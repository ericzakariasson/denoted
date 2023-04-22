import { nodeInputRule, Node } from "@tiptap/core";
import { mergeAttributes, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { CommandExtensionProps } from "./types";
import { CommandConfiguration } from "../../components/commands/types";
import { useEffect, useState, useRef } from "react";

export type IpfsImageProps = {
  cid: string;
  file: File;
};

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/editor/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image to IPFS');
  }

  const { uploads } = await res.json();

  const cid = uploads[0].IpfsHash;

  return cid;
}

export const IpfsImage = (
  props: CommandExtensionProps<IpfsImageProps>
) => {
  const [objectURL, setObjectURL] = useState<string | null>(null);
  const { cid, file } = props.node.attrs;
  
  console.log('rerender', { props, objectURL });
  // TODO: Loading state
  // TODO: Prevent rerendering on editor focus

  useEffect(() => {
    const fetchAndSetObjectUrl = async () => {
      console.log("fetch image from ipfs", cid);
  
      // https://gateway.pinata.cloud/ipfs/
      const res = await fetch(`https://ipfs.io/ipfs/${cid}`);
      const imageBlob = await res.blob();
      setObjectURL(URL.createObjectURL(imageBlob));
    };

    const uploadAndSetCid = async () => {
      console.log("upload image to ipfs", file);
  
      props.updateAttributes({ cid: await uploadImage(file) });
    };

    if (file.name && cid === null) {
      const localObjectURL = URL.createObjectURL(file);
      console.log('set local init image', localObjectURL);
      setObjectURL(localObjectURL);
      uploadAndSetCid();
    } else if (cid !== null) {
      fetchAndSetObjectUrl();
    } else {
      console.log('no file or cid', file, cid);
    }
  }, [cid, file, props]);

  useEffect(() => {
    return () => {
      console.log('URL.revokeObjectURL', objectURL);
      URL.revokeObjectURL(objectURL ?? '');
    };
  }, [objectURL]);

  return (
    <NodeViewWrapper as="span">
      {objectURL !== null && (
      <picture>
        <img src={objectURL} alt={cid ?? ''} /> 
      </picture>
      )}
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
    cid: undefined,
    file: undefined,
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
        alt: {
          default: null,
        },
        title: {
          default: null,
        },
        file: {
          default: null,
        }
      };
    },

    parseHTML() {
      return [
        {
          tag: 'ipfs-image',
        },
      ];
    },
  
    renderHTML({ HTMLAttributes }) {
      return ['ipfs-image', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },
  
    addNodeView() {
      return ReactNodeViewRenderer(IpfsImage);
    },
  });
