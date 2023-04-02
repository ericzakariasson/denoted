import { JSONContent } from "@tiptap/react";
import { CreatePageInput, Page, PageType } from "../composedb/page";
import { PageNode } from "../composedb/page-node";
import {
  decryptString,
  encryptString,
  generateEncryptionKey,
  importEncryptionKey,
} from "../lib/crypto";
import { getStoredEncryptionKey, storeEncryptionKey } from "../lib/lit";

export function serializePageNode(node: JSONContent): PageNode {
  const pageNode: PageNode = {
    type: node.type!,
    content: JSON.stringify(node.content),
  };

  if (node.attrs) {
    pageNode.attrs = JSON.stringify(node.attrs);
  }

  if (node.marks) {
    pageNode.marks = JSON.stringify(node.marks);
  }

  return pageNode;
}

export function deserializePageNode(pageNode: PageNode): JSONContent {
  return {
    type: pageNode.type,
    content: JSON.parse(pageNode.content),
    attrs: pageNode.attrs ? JSON.parse(pageNode.attrs) : undefined,
    marks: pageNode.marks ? JSON.parse(pageNode.marks) : pageNode.marks,
  };
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
  };
}

export function deserializePage(page: Page) {
  return {
    id: page.id,
    type: page.type,
    title: page.title,
    data: page.data.map((node) => deserializePageNode(node)),
    createdAt: new Date(page.createdAt),
    createdBy: page.createdBy,
  };
}

export async function encryptPageNode(
  pageNode: PageNode,
  key: CryptoKey
): Promise<PageNode> {
  return {
    type: await encryptString(pageNode.type!, key),
    content: await encryptString(JSON.stringify(pageNode.content), key),
    attrs: pageNode.attrs
      ? await encryptString(JSON.stringify(pageNode.attrs), key)
      : undefined,
    marks: pageNode.marks
      ? await encryptString(JSON.stringify(pageNode.marks), key)
      : undefined,
  };
}

export async function decryptPageNode(
  pageNode: PageNode,
  key: CryptoKey
): Promise<PageNode> {
  return {
    type: await decryptString(pageNode.type!, key),
    content: JSON.parse(await decryptString(pageNode.content, key)),
    attrs: pageNode.attrs
      ? JSON.parse(await decryptString(pageNode.attrs, key))
      : undefined,
    marks: pageNode.marks
      ? JSON.parse(await decryptString(pageNode.marks, key))
      : undefined,
  };
}

export async function encryptPage(
  page: CreatePageInput,
  userAddress: string
): Promise<CreatePageInput> {
  const { key, exportedKey } = await generateEncryptionKey();
  const { encryptedKey } = await storeEncryptionKey(exportedKey, userAddress);

  const [title, type, createdAt] = await Promise.all([
    await encryptString(page.title, key),
    await encryptString(page.type, key),
    await encryptString(page.createdAt, key),
  ]);

  const encryptedPageNodes = await Promise.all(
    page.data.map(async (node) => await encryptPageNode(node, key))
  );

  const input: CreatePageInput = {
    type: type as PageType,
    title,
    data: encryptedPageNodes,
    createdAt,
  };

  input.key = encryptedKey;

  return input;
}

export async function decryptPage(
  page: Page,
  userAddress: string
): Promise<Page> {
  console.log("page.key", page.key);
  const { encryptionKey } = await getStoredEncryptionKey(
    page.key!,
    userAddress
  );

  const { key } = await importEncryptionKey(encryptionKey);

  const [title, type, createdAt] = await Promise.all([
    await decryptString(page.title, key),
    await decryptString<PageType>(page.type, key),
    await decryptString(page.createdAt, key),
  ]);

  const decryptedPageNodes = await Promise.all(
    page.data.map(async (node) => await decryptPageNode(node, key))
  );

  return {
    id: page.id,
    type,
    title,
    data: decryptedPageNodes,
    createdAt: new Date(createdAt).toISOString(),
    createdBy: page.createdBy,
  };
}
