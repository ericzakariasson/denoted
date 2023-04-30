import { Node } from "@tiptap/core";
import { mergeAttributes, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { CommandExtensionProps } from "./types";
import { CommandConfiguration } from "../../components/commands/types";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Loader2 } from "lucide-react";
import { DataPill } from "../../components/DataPill";

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

  useEffect(() => {
    if (cid === null && !uploadAndSetCidMutation.isLoading) {
      setLocalUrl(URL.createObjectURL(file));
      uploadAndSetCidMutation.mutate(file);
    }
  }, [cid, file, uploadAndSetCidMutation]);

  useEffect(() => {
    return () => {
      if (objectUrlQuery.data) {
        URL.revokeObjectURL(objectUrlQuery.data);
      }
    };
  }, [objectUrlQuery.data]);

  const isError = uploadAndSetCidMutation.isError || objectUrlQuery.isError;
  const isLoading = uploadAndSetCidMutation.isLoading || objectUrlQuery.isLoading;

  if (isError) {
    return (
      <NodeViewWrapper as="span">
        <DataPill query={objectUrlQuery}>no data</DataPill>;
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper as="span">
      <picture className="relative">
        <img
          src={objectUrlQuery.data || localFileUrl || ""}
          alt={alt} title={title}
          className="inline-block"
          style={{ filter: "blur(4px)" }}
        />
        {isLoading && (
          <Loader2
            width={32}
            height={32}
            style={{ top: "calc(50% - 16px)", left: "calc(50% - 16px)" }}
            className="animate-spin absolute"
          />
        )}
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
