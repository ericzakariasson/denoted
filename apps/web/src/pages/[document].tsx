import { JSONContent } from "@tiptap/react";
import { GetServerSideProps, NextPage } from "next/types";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Viewer } from "../components/Viewer";
import { getPageQuery, Page } from "../composedb/page";
import { decryptPage, deserializePage } from "../utils/page-helper";

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

const DocumentPage: NextPage<Props> = ({ page: initialPage, isEditor }) => {
  const [page, setPage] = useState<ReturnType<typeof deserializePage> | null>(
    null
  );
  const { address } = useAccount();

  const handlePageLoad = useCallback(async () => {
    if (!initialPage.key) {
      const deserializedPage = deserializePage(initialPage);
      setPage(deserializedPage);
    }

    if (!address) {
      return;
    }

    const decryptedPage = await decryptPage(initialPage, address);
    const deserializedPage = deserializePage(decryptedPage);
    setPage(deserializedPage);
  }, [initialPage, address]);

  useEffect(() => {
    handlePageLoad();
  }, [initialPage, handlePageLoad]);

  const json: JSONContent = {
    type: "doc",
    content: page?.data ?? [],
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <h1 className="mb-8 text-5xl font-bold">{page?.title}</h1>
        {isEditor && (
          <span className="mb-1 inline-block rounded-full border px-2 py-0">
            owner
          </span>
        )}
      </div>
      {page && <Viewer json={json} />}
    </div>
  );
};

export default DocumentPage;
