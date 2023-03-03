import { gql } from "graphql-request";
import { composeClient } from "../lib/compose";

export type Note = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
  };
  createdAt: string;
};

type CreateNoteMutation = {
  createNote: {
    document: Note;
  };
};

export async function createNote(
  title: string,
  content: string,
  createdAt: string
) {
  return await composeClient.executeQuery<CreateNoteMutation>(
    gql`
      mutation ($content: NoteInput!) {
        createNote(input: { content: $content }) {
          document {
            id
            title
            content
            author {
              id
            }
            createdAt
          }
        }
      }
    `,
    { content: { title, content, createdAt } }
  );
}

export type GetNotesQuery = {
  noteIndex: {
    edges: {
      node: Note;
    }[];
  };
};

export async function getNotesQuery() {
  return await composeClient.executeQuery<GetNotesQuery>(gql`
    query {
      noteIndex(first: 1000) {
        edges {
          node {
            id
            title
            content
            author {
              id
            }
            createdAt
          }
        }
      }
    }
  `);
}

type GetNoteQuery = {
  node: Note;
};

export async function getNoteQuery(id: string) {
  return await composeClient.executeQuery<GetNoteQuery>(
    gql`
      query ($id: ID!) {
        node(id: $id) {
          ... on Note {
            id
            title
            content
            author {
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
