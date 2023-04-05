import { gql } from "graphql-request";
import { composeClient } from "../lib/compose";
import { PageNode } from "./page-node";
type DID = {
  id: string;
};

export type PageType = "COLLECTION" | "PAGE";

export type Page = {
  id: string;
  key?: string | null;
  type: PageType;
  title: string;
  data: PageNode[];
  createdBy: DID;
  createdAt: string;
  updatedBy?: DID | null;
  updatedAt?: string | null;
};

type CreatePageMutation = {
  createPage: {
    document: Page;
  };
};

export type CreatePageInput = {
  key?: string;
  title: string;
  data: PageNode[];
  createdAt: string;
  type: PageType;
};

export async function createPage(input: CreatePageInput) {
  return await composeClient.executeQuery<CreatePageMutation>(
    gql`
      mutation ($content: PageInput!) {
        createPage(input: { content: $content }) {
          document {
            id
            createdBy {
              id
            }
            createdAt
          }
        }
      }
    `,
    {
      content: input,
    }
  );
}

export type GetPagesQuery = {
  pageIndex: {
    edges: {
      node: Page;
    }[];
  };
};

export async function getPagesQuery() {
  return await composeClient.executeQuery<GetPagesQuery>(gql`
    query {
      pageIndex(first: 1000) {
        edges {
          node {
            id
            type
            key
            title
            createdBy {
              id
            }
            createdAt
          }
        }
      }
    }
  `);
}

type GetPageQuery = {
  node: Page;
};

export async function getPageQuery(id: string) {
  return await composeClient.executeQuery<GetPageQuery>(
    gql`
      query ($id: ID!) {
        node(id: $id) {
          ... on Page {
            id
            type
            key
            title
            data {
              type
              content
              attrs
              marks
            }
            createdBy {
              id
            }
            createdAt
          }
        }
      }
    `,
    { id }
  );
}
