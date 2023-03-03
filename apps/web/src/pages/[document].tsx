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
  const doc = query.data?.node;

  if (!doc) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      isEditor: true,
      doc,
    },
  };
};

const DocumentPage: NextPage<Props> = ({ doc, isEditor }) => {
  return (
    <div>
      {isEditor && (
        <span className="mb-4 inline-block rounded-full border px-2 py-0">
          owner
        </span>
      )}
      <h1 className="mb-8 text-6xl font-bold">{doc.title}</h1>
      <Viewer json={JSON.parse(doc.content)} />
    </div>
  );
};

export default DocumentPage;
