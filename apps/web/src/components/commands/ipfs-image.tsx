import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Loader2 } from "lucide-react";
import { CommandExtensionProps } from "../../lib/tiptap/types";
import { DataPill } from "../DataPill";
import { decrypt, encrypt } from "../../lib/crypto";

type IpfsImageProps = {
  cid: string | null;
  alt: string;
  title: string;
  file: File | undefined;
  type: string | undefined;
  iv: string | null;
};

async function getIpfsImage(
  cid: string,
  { type, iv, encryptionKey }: Pick<IpfsImageProps, 'type' | 'iv'> & { encryptionKey?: CryptoKey },
) {
  const res = await fetch(`https://cloudflare-ipfs.com/ipfs/${cid}`, { cache: "force-cache" });

  if (!res.ok) {
    throw new Error(`Failed to fetch image with CID ${cid} from IPFS`);
  }

  const imageBlob = await res.blob();

  if (iv) {
    if (!encryptionKey) {
      throw new Error("Can't load encrytped image from IPFS due to missing key"); 
    }
    const encryptedBuffer = await imageBlob.arrayBuffer();
    const decyptedImageBuffer = await decrypt(encryptedBuffer, iv, encryptionKey);
    return new Blob([decyptedImageBuffer], { type });
  }

  return imageBlob;
}

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

const IpfsImage = (
  props: CommandExtensionProps<IpfsImageProps>
) => {
  const { cid, file, type, iv, alt, title } = props.node.attrs;
  const { encryptionKey } = props.editor.extensionStorage;
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const fetchImage = useQuery({
    queryKey: ["ipfs-image", cid],
    queryFn: async ({ queryKey }) => {
      const [_, cid] = queryKey;

      if (!cid) {
        throw new Error("Can't load image from IPFS due to missing CID");
      }

      return await getIpfsImage(cid, { type, iv, encryptionKey: encryptionKey! });
    },
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    enabled: cid !== null,
  });

  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const fileBuffer = await file.arrayBuffer();
      const { iv, encrypted } = await encrypt(fileBuffer, encryptionKey);
      const encryptedBlob = new Blob([encrypted], { type: "application/octet-stream" });
      const encryptedFile = new File([encryptedBlob], file.name, { lastModified: file.lastModified, });
      const cid = await uploadImageToIpfs(encryptedFile);

      return {
        cid,
        file,
        type: file.type,
        iv,
      };
    },
    onSuccess: ({ cid, file, type, iv }) => {
      props.updateAttributes({
        cid,
        alt: file?.name,
        title: `${file?.name} uploaded to IPFS with CID ${cid}`,
        file: undefined,
        type,
        iv,
      });
    },
  });

  const isError = uploadImage.isError || fetchImage.isError;

  const placeholderImage = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 200 150'%2F%3E";

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
      <NodeViewWrapper as="div">
        <DataPill query={fetchImage}>no data</DataPill>
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
          src={objectUrl ?? placeholderImage}
          alt={alt}
          title={title}
          className={uploadImage.isLoading ? "blur-sm inline-block m-2" : "inline-block m-2"}
        />
        {(uploadImage.isLoading || fetchImage.isLoading) && (
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

export async function onPublish(attrs: Record<string, any> | undefined, encryptionKey?: CryptoKey) : Promise<Partial<IpfsImageProps>> {
  const { cid, alt, type, iv } = attrs as IpfsImageProps;

  if (!cid) {
    throw new Error("Can't load image from IPFS due to missing CID");
  }
  
  const imageBlob = await getIpfsImage(cid, { type, iv, encryptionKey });
  const file = new File([imageBlob], alt);
  
  const unencryptedCid = await uploadImageToIpfs(file);

  return {
    ...attrs,
    cid: unencryptedCid,
    iv: null,
    file: undefined,
  };
} 