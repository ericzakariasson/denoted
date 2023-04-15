import { JSONContent } from "@tiptap/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useMutation, useQueryClient } from "wagmi";
import { PageEditor, SavePageData } from "../components/PageEditor";
import { Viewer } from "../components/Viewer";
import {
  getPageQuery,
  getPagesQuery,
  Page,
  updatePage,
} from "../composedb/page";
import { trackEvent } from "../lib/analytics";
import { composeClient } from "../lib/compose";
import {
  decryptPage,
  deserializePage,
  encryptPage,
  serializePage,
} from "../utils/page-helper";
import { Seo } from "./seo";

type Props = {
  page: Page;
};

type MetaTagsProps = {
  id: string;
  title: string;
  description?: string | undefined;
  image?: string | undefined;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const pageId = ctx.params?.document?.toString();

  if (!pageId) {
    return {
      notFound: true,
    };
  }

  const pageQuery = await getPageQuery(pageId);
  const page = pageQuery.data?.node;

  const pageQueryIds = await getPagesQuery();
  const pageIds = pageQueryIds.data?.pageIndex.edges.map(({ node }) => node.id);

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      pageIds,
    },
  };
};

const DocumentPage: NextPage<Props> = ({ page: initialPage }) => {
  const [page, setPage] = useState<ReturnType<typeof deserializePage> | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

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

  const isOwner = page?.createdBy.id === composeClient.id;

  const queryClient = useQueryClient();

  const updatePageMutation = useMutation(
    async ({ page: updatedPage, address, isPublic }: SavePageData) => {
      const pageInput = serializePage(
        "PAGE",
        updatedPage.title,
        updatedPage.content,
        new Date()
      );

      const updateResult = await updatePage(
        page!.id,
        isPublic ? pageInput : await encryptPage(pageInput, address)
      );

      // NOTE: Updating here instead of onSuccess to avoid decrypting the returned result
      setPage((currentPage) =>
        currentPage
          ? {
              ...currentPage,
              title: updatedPage.title,
              data: updatedPage.content,
            }
          : null
      );
      return updateResult;
    },
    {
      onMutate: () => trackEvent("Page Save Clicked"),
      onError: (error) => {
        console.error("Update Page Error", error);
      },
      onSuccess: async ({ data, errors }) => {
        console.info("Update Page Success", data, errors);

        const page = data?.updatePage?.document ?? null;

        if (page) {
          queryClient.invalidateQueries({
            queryKey: ["PAGES", composeClient.id],
          });
          trackEvent("Page Saved", { pageId: page.id });
          setIsEditing(false);
        }
      },
    }
  );

  if (!page) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-500">Page not found</h1>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div>
        <PageEditor
          page={page}
          onSave={updatePageMutation.mutate}
          isSaving={updatePageMutation.isLoading}
        />
      </div>
    );
  }

  const json: JSONContent = {
    type: "doc",
    content: page?.data ?? [],
  };

  return (
    <div>
      <Head>
        <Seo page={page} />
      </Head>
      <div className="flex items-start justify-between">
        <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      </div>
      <Viewer key={page.id} json={json} />
      {isOwner && (
        <button
          className="mt-4 flex justify-between rounded-xl border border-gray-700 px-4 py-3 leading-tight text-gray-700 shadow-sm"
          onClick={() => setIsEditing(true)}
        >
          Edit page
        </button>
      )}
    </div>
  );
};

export default DocumentPage;
