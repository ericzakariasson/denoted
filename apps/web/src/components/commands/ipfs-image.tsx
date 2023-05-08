import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Loader2 } from "lucide-react";
import { CommandExtensionProps } from "../../lib/tiptap/types";
import { DataPill } from "../DataPill";
import { decrypt, encrypt } from "../../lib/crypto";

export type IpfsImageProps = {
  cid: string | null;
  alt: string;
  title: string;
  file: File | undefined;
  type: string | undefined;
  iv: string | null;
};

async function uploadImageToIpfs(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/editor/upload", {
    method: "POST",
    body: formData,
    headers: {
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to upload image to IPFS");
  }

  const { uploads } = await res.json();

  const cid = uploads[0].IpfsHash;

  return cid;
}

function readFileAsArrayBuffer(file: File | Blob): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && event.target.result) {
        resolve(event.target.result as ArrayBuffer);
      } else {
        reject(new Error('Failed to read file as ArrayBuffer.'));
      }
    };

    reader.onerror = (event: ProgressEvent<FileReader>) => {
      reject(event.target?.error || new Error('Failed to read file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

export const IpfsImage = (
  props: CommandExtensionProps<IpfsImageProps>
) => {
  const { cid, file, type, iv, alt, title } = props.node.attrs;
  const { encryptionKey } = props.editor.extensionStorage;
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const fetchImage = useQuery({
    queryKey: ["ipfs-image", cid],
    queryFn: async () => {
      const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
      const imageBlob = await res.blob();

      if (iv) {
        console.log("iv", iv);
        const encryptedBuffer = await readFileAsArrayBuffer(imageBlob);
        const decyptedImageBuffer = await decrypt(encryptedBuffer, iv, encryptionKey);
        return new Blob([decyptedImageBuffer], { type });
      }

      return imageBlob;
    },
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    enabled: cid !== null,
  });

  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const fileBuffer = await readFileAsArrayBuffer(file);
      const { iv, encrypted } = await encrypt(fileBuffer, encryptionKey);
      const encryptedBlob = new Blob([encrypted], { type: "application/octet-stream" });
      const encryptedFile = new File([encryptedBlob], file.name, { lastModified: file.lastModified, });
      const cid = await uploadImageToIpfs(encryptedFile);

      return {
        cid,
        iv,
        type: file.type,
      };
    },
    onSuccess: ({ cid, iv, type }) => {
      props.updateAttributes({
        cid,
        iv,
        type,
        file: undefined,
        alt: file?.name,
        title: `${file?.name} uploaded to IPFS with CID ${cid}`,
      });
    },
  });

  const isError = uploadImage.isError || fetchImage.isError;
  const isLoading = uploadImage.isLoading || fetchImage.isLoading || objectUrl === null;

  useEffect(() => {
    if (file && cid === null && !uploadImage.isLoading) {
      setObjectUrl(URL.createObjectURL(file));
      uploadImage.mutate(file);
    }
  }, [cid, file, uploadImage]);

  useEffect(() => {
    if (fetchImage.data) {
      setObjectUrl(URL.createObjectURL(fetchImage.data));
    }
  }, [fetchImage.data]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  if (isError) {
    return (
      <NodeViewWrapper as="span">
        <DataPill query={fetchImage}>no data</DataPill>;
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper as="div">
      <picture
        className="relative inline-block drag-handle"
        data-drag-handle
        draggable={true}
        contentEditable={false}
      >
        <img
          src={objectUrl || ""}
          alt={alt}
          title={title}
          className={isLoading ? "blur-sm line-block" : "line-block"}
        />
        {isLoading && (
          <span className="absolute w-[32px] h-[32px] inset-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2 width={32} height={32} className="animate-spin" />
          </span>
        )}
      </picture>
    </NodeViewWrapper>
  );
};

export const extension = Node.create({
  name: 'ipfs-image',

  inline: false,

  group: 'block',

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
      },
      iv: {
        default: null,
      },
      type: {
        default: null,
      },
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
    return ['ipfs-image', HTMLAttributes];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IpfsImage);
  },
});
