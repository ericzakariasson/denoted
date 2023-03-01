import { GetServerSideProps, NextPage } from "next/types";
import { useRef, useState } from "react";

import { Editor } from "../components/Editor";
import { Viewer } from "../components/Viewer";
import { getNoteQuery } from "../composedb/note";

type Props = {
  doc: {
    id: string;
    title: string;
    content: string;
  };
  isEditor: boolean;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const documentId = ctx.params?.document?.toString();

  if (!documentId) {
    return {
      notFound: true,
    };
  }

  const query = await getNoteQuery(documentId);

  const edge = query.data?.edges?.at(0);

  if (!edge) {
    return {
      notFound: true,
    };
  }

  const doc = edge.node;

  return {
    props: {
      isEditor: true,
      doc,
    },
  };
};

const DocumentPage: NextPage<Props> = ({ doc, isEditor }) => {
  const [title, setTitle] = useState(doc.title);
  const [isEditing, setIsEditing] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-16">
      <div className="flex justify-between">
        {isEditing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setIsEditing(false);
            }}
          >
            <input
              placeholder="Untitled"
              className="text-8xl"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              ref={titleInputRef}
            />
          </form>
        ) : (
          <h1
            className="text-8xl"
            onDoubleClick={() => {
              setIsEditing(true);
              setTimeout(() => titleInputRef.current?.focus(), 0);
            }}
          >
            {title}
          </h1>
        )}
        {isEditor && !isEditing && (
          <button onClick={() => setIsEditing(true)}>edit</button>
        )}
        {isEditor && isEditing && (
          <button onClick={() => setIsEditing(false)}>save</button>
        )}
      </div>
      {isEditing ? (
        <div className="border">
          <Editor initialContent={JSON.parse(doc.content)} />
        </div>
      ) : (
        <Viewer json={JSON.parse(doc.content)} />
      )}
    </div>
  );
};

export default DocumentPage;
