import { gql } from "graphql-request";
import { composeClient } from "../lib/compose";

type DID = {
  id: string;
};

type PageType = "COLLECTION" | "PAGE";

export type Page = {
  id: string;
  type: PageType;
  data: string;
  createdBy: DID;
  createdAt: string;
  updatedBy: DID;
  updatedAt: string;
};

type CreatePageMutation = {
  createPage: {
    document: Page;
  };
};

export async function createPage(data: string, createdAt: string) {
  return await composeClient.executeQuery<CreatePageMutation>(
    gql`
      mutation ($content: PageInput!) {
        createPage(input: { content: $content }) {
          document {
            id
            data
            createdBy {
              id
            }
            createdAt
          }
        }
      }
    `,
    {
      content: {
        data,
        type: "PAGE",
        createdAt,
      },
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
            data
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
            data
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
