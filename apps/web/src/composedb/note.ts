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
  return await composeClient.executeQuery<Note>(`
  mutation {
    createNote(input: {
      content: {
        title: "${title}",
        content:"${content}",
      }
    }) {
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
    `);
}

export async function getNotes() {
  return await composeClient.executeQuery<Note>(`
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
