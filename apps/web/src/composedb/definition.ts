// This is an auto-generated file, do not edit manually
import type { RuntimeCompositeDefinition } from "@composedb/types";
export const definition: RuntimeCompositeDefinition = {
  models: {
    Page: {
      id: "kjzl6hvfrbw6camd36yujz27qkterrhi6btylq9peb24erpntq9ftojw165vqhz",
      accountRelation: { type: "list" },
    },
  },
  objects: {
    PageNode: {
      type: { type: "string", required: true },
      attrs: { type: "string", required: false },
      marks: { type: "string", required: false },
      content: { type: "string", required: true },
    },
    Page: {
      data: {
        type: "list",
        required: false,
        item: {
          type: "reference",
          refType: "object",
          refName: "PageNode",
          required: false,
        },
      },
      type: {
        type: "reference",
        refType: "enum",
        refName: "PageType",
        required: false,
      },
      title: { type: "string", required: true },
      createdAt: { type: "datetime", required: true },
      deletedAt: { type: "datetime", required: false },
      updatedAt: { type: "datetime", required: false },
      version: { type: "view", viewType: "documentVersion" },
      createdBy: { type: "view", viewType: "documentAccount" },
      deletedBy: { type: "view", viewType: "documentAccount" },
      updatedBy: { type: "view", viewType: "documentAccount" },
    },
  },
  enums: { PageType: ["COLLECTION", "PAGE"] },
  accountData: { pageList: { type: "connection", name: "Page" } },
};
