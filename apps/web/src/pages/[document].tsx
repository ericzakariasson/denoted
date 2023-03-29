import { GetServerSideProps, NextPage } from "next/types";

import { Viewer } from "../components/Viewer";
import { getPageQuery, Page } from "../composedb/page";

type Props = {
  doc: Page;
  isEditor: boolean;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const documentId = ctx.params?.document?.toString();

  if (!documentId) {
    return {
      notFound: true,
    };
  }

  const query = await getPageQuery(documentId);
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
  const { title, body } = JSON.parse(doc.data);
  return (
    <div>
      <div className="flex items-start justify-between">
        <h1 className="mb-8 text-5xl font-bold">{title}</h1>
        {isEditor && (
          <span className="mb-1 inline-block rounded-full border px-2 py-0">
            owner
          </span>
        )}
      </div>
      <Viewer json={JSON.parse(JSON.parse(body))} />
    </div>
  );
};

export default DocumentPage;
