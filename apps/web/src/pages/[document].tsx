import { JSONContent } from "@tiptap/react";
import { GetServerSideProps, NextPage } from "next/types";

import { Viewer } from "../components/Viewer";
import { getPageQuery, Page } from "../composedb/page";
import { parsePageNode } from "../composedb/page-node";

type Props = {
  page: Page;
  isEditor: boolean;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const pageId = ctx.params?.document?.toString();

  if (!pageId) {
    return {
      notFound: true,
    };
  }

  const query = await getPageQuery(pageId);
  const page = query.data?.node;

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      isEditor: true,
      page,
    },
  };
};

const DocumentPage: NextPage<Props> = ({ page, isEditor }) => {
  const pageNodes = page.data.map((pageNode) => parsePageNode(pageNode));

  const json: JSONContent = {
    type: "doc",
    content: pageNodes,
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
        {isEditor && (
          <span className="mb-1 inline-block rounded-full border px-2 py-0">
            owner
          </span>
        )}
      </div>
      <Viewer json={json} />
    </div>
  );
};

export default DocumentPage;
