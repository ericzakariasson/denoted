import { JSONContent } from "@tiptap/react";
import {
  CreatePageInput,
  DID,
  Page,
  PageType,
  updatePage,
} from "../composedb/page";
import { PageNode } from "../composedb/page-node";
import {
  decryptString,
  encryptString,
  importEncryptionKey,
} from "../lib/crypto";
import { getStoredEncryptionKey, storeEncryptionKey } from "../lib/lit";

export function serializePageNode(node: JSONContent): PageNode {
  const pageNode: PageNode = {
    type: node.type!,
  };

  if (node.content) {
    pageNode.content = JSON.stringify(node.content);
  }

  if (node.attrs) {
    pageNode.attrs = JSON.stringify(node.attrs);
  }

  if (node.marks) {
    pageNode.marks = JSON.stringify(node.marks);
  }

  if (node.text) {
    pageNode.text = JSON.stringify(node.text);
  }

  return pageNode;
}

export function deserializePageNode(pageNode: PageNode): JSONContent {
  const json: JSONContent = {
    type: pageNode.type,
  };
  if (pageNode.content) {
    json.content = JSON.parse(
      pageNode.content
    ) as unknown as JSONContent["content"];
  }

  if (pageNode.attrs) {
    json.attrs = JSON.parse(pageNode.attrs) as unknown as JSONContent["attrs"];
  }

  if (pageNode.marks) {
    json.marks = JSON.parse(pageNode.marks) as unknown as JSONContent["marks"];
  }

  if (pageNode.text) {
    json.text = JSON.parse(pageNode.text) as unknown as JSONContent["text"];
  }

  return json;
}

export function serializePage(
  type: PageType,
  title: string,
  data: JSONContent[],
  createdAt: Date
): CreatePageInput {
  return {
    type,
    title,
    data: data.map((node) => serializePageNode(node)),
    createdAt: createdAt.toISOString(),
    key: null,
  };
}

export type DeserializedPage = {
  id: string;
  type: PageType;
  title: string;
  data: JSONContent[];
  createdAt: Date;
  createdBy: DID;
  updatedAt?: Date;
  updatedBy?: DID;
  deletedAt?: Date;
  deletedBy?: DID;
};

export function deserializePage(page: Page) {
  const deserializedPage: DeserializedPage = {
    id: page.id,
    type: page.type,
    title: page.title,
    data: page.data.map((node) => deserializePageNode(node)),
    createdAt: new Date(page.createdAt),
    createdBy: page.createdBy,
  };

  if (page.updatedAt) {
    deserializedPage.updatedAt = new Date(page.updatedAt);
  }

  if (page.deletedAt) {
    deserializedPage.deletedAt = new Date(page.deletedAt);
  }

  return deserializedPage;
}

export async function encryptPageNode(
  pageNode: PageNode,
  key: CryptoKey
): Promise<PageNode> {
  return {
    type: await encryptString(pageNode.type!, key),
    content: pageNode.content
      ? await encryptString(JSON.stringify(pageNode.content), key)
      : undefined,
    attrs: pageNode.attrs
      ? await encryptString(JSON.stringify(pageNode.attrs), key)
      : undefined,
    marks: pageNode.marks
      ? await encryptString(JSON.stringify(pageNode.marks), key)
      : undefined,
    text: pageNode.text
      ? await encryptString(JSON.stringify(pageNode.text), key)
      : undefined,
  };
}

export async function decryptPageNode(
  pageNode: PageNode,
  key: CryptoKey
): Promise<PageNode> {
  return {
    type: await decryptString(pageNode.type!, key),
    content: pageNode.content
      ? JSON.parse(await decryptString(pageNode.content, key))
      : undefined,
    attrs: pageNode.attrs
      ? JSON.parse(await decryptString(pageNode.attrs, key))
      : undefined,
    marks: pageNode.marks
      ? JSON.parse(await decryptString(pageNode.marks, key))
      : undefined,
    text: pageNode.text
      ? JSON.parse(await decryptString(pageNode.text, key))
      : undefined,
  };
}

export async function encryptPage(
  page: CreatePageInput,
  userAddress: string,
  encryptionKey: CryptoKey,
): Promise<CreatePageInput> {
  const [title, type] = await Promise.all([
    await encryptString(page.title, encryptionKey),
    await encryptString(page.type, encryptionKey),
  ]);

  const encryptedPageNodes = await Promise.all(
    page.data.map(async (node) => await encryptPageNode(node, encryptionKey))
  );

  const { encryptedKey } = await storeEncryptionKey(encryptionKey, userAddress);

  const input: CreatePageInput = {
    type: type as PageType,
    title,
    data: encryptedPageNodes,
    createdAt: page.createdAt,
    key: encryptedKey,
  };

  return input;
}

export async function importStoredEncryptionKey(
  key: string,
  userAddress: string
) {
  const { encryptionKey } = await getStoredEncryptionKey(key, userAddress);
  return await importEncryptionKey(encryptionKey);
}

export async function decryptPage(
  page: Page,
  encryptionKey: CryptoKey
): Promise<Page> {
  const [title, type] = await Promise.all([
    await decryptString(page.title, encryptionKey),
    await decryptString<PageType>(page.type, encryptionKey),
  ]);

  const decryptedPageNodes = await Promise.all(
    page.data.map(async (node) => await decryptPageNode(node, encryptionKey))
  );

  return {
    key: page.key,
    id: page.id,
    type,
    title,
    data: decryptedPageNodes,
    createdAt: new Date(page.createdAt).toISOString(),
    createdBy: page.createdBy,
  };
}

export async function deletePage(id: string) {
  return await updatePage(id, {
    key: "",
    title: "",
    data: [],
    deletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
