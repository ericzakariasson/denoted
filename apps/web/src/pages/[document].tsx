import { JSONContent } from "@tiptap/react";
import { GetServerSideProps, NextPage } from "next/types";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Viewer } from "../components/Viewer";
import { getPageQuery, Page } from "../composedb/page";
import { composeClient } from "../lib/compose";
import { decryptPage, deserializePage } from "../utils/page-helper";

type Props = {
  page: Page;
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
      page,
    },
  };
};

const DocumentPage: NextPage<Props> = ({ page: initialPage }) => {
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

  const isOwner = page?.createdBy.id === composeClient.id;

  if (!page) {
    return null;
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      </div>
      <Viewer json={json} />
    </div>
  );
};

export default DocumentPage;
