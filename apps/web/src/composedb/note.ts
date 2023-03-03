import { gql } from "graphql-request";
import { composeClient } from "../lib/compose";

type Note = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
  };
};

export async function createNote(title: string, content: string) {
  return await composeClient.executeQuery<Note>(
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
          }
        }
      }
    `,
    { content: { title, content } }
  );
}

export type GetNotesQuery = {
  edges: {
    node: Note;
  }[];
};

export async function getNotesQuery() {
  return await composeClient.executeQuery<GetNotesQuery>(`
    query {
      noteIndex(first: 100) {
        edges {
          node {
            id
            title
            content
            author {
              id
            }
          }
        }
      }
    }
    `);
}

type GetNoteQuery = {
  edges: {
    node: Note;
  }[];
};

export async function getNoteQuery<GetNoteQuery>(id: string) {
  return await composeClient.executeQuery<GetNotesQuery>(`
    query {
      noteIndex(first: 100) {
        edges {
          node {
            id
            title
            content
            author {
              id
            }
          }
        }
      }
    }
    `);
}
