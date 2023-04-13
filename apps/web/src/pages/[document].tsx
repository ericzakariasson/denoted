import { JSONContent } from "@tiptap/react";
import { GetServerSideProps, NextPage, GetStaticPaths } from "next/types";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useMutation, useQueryClient } from "wagmi";
import { PageEditor, SavePageData } from "../components/PageEditor";
import { Viewer } from "../components/Viewer";
import { getPageQuery, getPagesQuery, Page, updatePage } from "../composedb/page";
import { trackEvent } from "../lib/analytics";
import { composeClient } from "../lib/compose";
import {
  decryptPage,
  deserializePage,
  encryptPage,
  serializePage,
} from "../utils/page-helper";
import { getBaseUrl } from "../utils/base-url";

type Props = {
  page: Page;
};

type MetaTagsProps = {
  id: string;
  title: string;
  description?: string;
  image?: string;
};

type PageIdList = {
  pageIds: string[];
}

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

export const getStaticPaths: GetStaticPaths = async () => {
  const { pageIds } = await fetchAllPageIds();

  const paths = pageIds.map((id) => ({
    params: { pageId: id },
  }));

  return {
    paths,
    fallback: true,
  };
};


async function fetchAllPageIds(): Promise<PageIdList> {
  const query = await getPagesQuery()
  const pages = query.data?.pageIndex.edges
  if(!pages) {
      throw new Error("No pages found");
  }
  const pageIds = pages.map(({ node }) => node.id);
  return {
      pageIds,
}
}

const DocumentPage: NextPage<Props> = ({ page: initialPage }) => {
  const [page, setPage] = useState<ReturnType<typeof deserializePage> | null>(
    null
  );
  const [metaTags, setMetaTags] = useState<MetaTagsProps | null>(null);

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
      setMetaTags((currentMetaTags) => 
        currentMetaTags ? {
          ...currentMetaTags,
          id: page!.id,
          title: updatedPage.title,
          description: updatedPage.content[0].text,
          image: ""
        } : null)
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

  if (initialPage.createdBy.id !== composeClient.id) {
    return (
      <div>
        <h1 className="text-gray- text-3xl font-bold">Page not found</h1>
      </div>
    );
  }

  if (!page || !metaTags) {
    return null;
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
        <title>{page.title}</title>
        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${getBaseUrl()}/${metaTags.id}`} />
        <meta property="og:image" content={"imageHERE"} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.title} />
        <meta name="twitter:description" content={metaTags.description} />
        <meta name="twitter:url" content={`${getBaseUrl()}/${metaTags.id}`} />
        <meta name="twitter:image" content={metaTags.image} />
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
