import { Node } from "@tiptap/core";
import { mergeAttributes, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { CommandExtensionProps } from "./types";
import { CommandConfiguration } from "../../components/commands/types";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "react-query";

export type IpfsImageProps = {
  cid: string;
  alt: string;
  title: string;
  file: File;
};

async function uploadImageToIpfs(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/editor/upload', {
    method: 'POST',
    body: formData,
    headers: {
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error('Failed to upload image to IPFS');
  }

  const { uploads } = await res.json();

  const cid = uploads[0].IpfsHash;

  return cid;
}

function Spinner() {
  return (
    <div role="status">
      <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}


export const IpfsImage = (
  props: CommandExtensionProps<IpfsImageProps>
) => {
  const { cid, file, alt, title } = props.node.attrs;
  const [localFileUrl, setLocalUrl] = useState<string | null>();

  const objectUrlQuery = useQuery({
    queryKey: ['ipfs-image', 'object-url', cid],
    queryFn: async () => {
      const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
      const imageBlob = await res.blob();
      return URL.createObjectURL(imageBlob);
    },
    onSuccess: () => {
      if (localFileUrl) {
        console.log("cleanup localFileUrl", localFileUrl);
        URL.revokeObjectURL(localFileUrl);
        setLocalUrl(null);
      }
    },
    enabled: cid !== null,
  });

  const uploadAndSetCidMutation = useMutation({
    mutationFn: uploadImageToIpfs,
    onSuccess: (cid) => {
      props.updateAttributes({
        cid,
        file: undefined,
        alt: file.name,
        title: `${file.name} uploaded to IPFS with CID ${cid}`,
      });
    },
  });
  
  console.log("render", { attrs: props.node.attrs, localFileUrl, objectUrlQuery, uploadAndSetCidMutation });

  useEffect(() => {
    if (cid === null && !uploadAndSetCidMutation.isLoading) {
      setLocalUrl(URL.createObjectURL(file));
      uploadAndSetCidMutation.mutate(file);
    }
  }, [cid, file, uploadAndSetCidMutation]);

  useEffect(() => {
    return () => {
      if (objectUrlQuery.data) {
        console.log("cleanup objectUrlQuery", objectUrlQuery.data);
        URL.revokeObjectURL(objectUrlQuery.data);
      }
    };
  }, [objectUrlQuery.data]);

  const isError = uploadAndSetCidMutation.isError || objectUrlQuery.isError;
  const isLoading = true; // uploadAndSetCidMutation.isLoading || objectUrlQuery.isLoading;

  if (isError) {
    return (
      <NodeViewWrapper as="span">
        invalid image
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper as="span">
      <picture>
        <img
          src={objectUrlQuery.data || localFileUrl || ''}
          alt={alt} title={title}
          className={[
            isLoading ? "blur-sm" : "",
            "inline-block",
          ].join(' ')}
        />
        {isLoading && <Spinner />}
      </picture>
    </NodeViewWrapper>
  );
};

export const command: CommandConfiguration<IpfsImageProps> = {
  command: 'ipfs-image',
  title: 'IPFS Image',
  icon: null,
  blockType: "inline",
  defaultValues: {
    cid: undefined,
    alt: undefined,
    title: undefined,
    file: undefined,
  },
  ConfigComponent: IpfsImage,
}

export const extension = Node.create({
    name: 'ipfs-image',

    addOptions() {
      return {
        inline: false,
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
