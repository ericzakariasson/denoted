import { gql } from "graphql-request";
import { composeClient } from "../lib/compose";
import { PageNode } from "./page-node";
export type DID = {
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
  deletedBy?: DID | null;
  deletedAt?: string | null;
};

type CreatePageMutation = {
  createPage: {
    document: Page;
  };
};

export type CreatePageInput = {
  key: string | null;
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

export type UpdatePageInput = Partial<Omit<Page, "id">>;

type UpdatePageMutation = {
  updatePage: {
    document: Page;
  };
};

export async function updatePage(id: string, input: UpdatePageInput) {
  return await composeClient.executeQuery<UpdatePageMutation>(
    gql`
      mutation ($id: ID!, $content: PartialPageInput!) {
        updatePage(input: { id: $id, content: $content }) {
          document {
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
            updatedBy {
              id
            }
            updatedAt
            deletedBy {
              id
            }
            deletedAt
          }
        }
      }
    `,
    {
      id,
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
            updatedBy {
              id
            }
            updatedAt
            deletedBy {
              id
            }
            deletedAt
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
            updatedBy {
              id
            }
            updatedAt
            deletedBy {
              id
            }
            deletedAt
          }
        }
      }
    `,
    { id }
  );
}
