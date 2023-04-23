import { JSONContent } from "@tiptap/react";
import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useMutation, useQueryClient } from "wagmi";
import { PageEditor, SavePageData } from "../components/PageEditor";
import { Viewer } from "../components/Viewer";
import { Page, getPageQuery, updatePage } from "../composedb/page";
import { trackEvent } from "../lib/analytics";
import { composeClient } from "../lib/compose";
import {
  DeserializedPage,
  decryptPage,
  deserializePage,
  encryptPage,
  serializePage,
} from "../utils/page-helper";
import { Edit, Loader2, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { Layout } from "../components/Layout";
import { Skeleton } from "../components/ui/skeleton";
const PublishMenu = dynamic(
  async () =>
    import("../components/PublishMenu").then((module) => module.PublishMenu),
  { ssr: false }
);

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

  const pageQuery = await getPageQuery(pageId);
  const page = pageQuery.data?.node;

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
  const [page, setPage] = useState<DeserializedPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useAccount();

  const handlePageLoad = useCallback(async () => {
    setIsLoading(true);
    if (!initialPage.key) {
      const deserializedPage = deserializePage(initialPage);
      setPage(deserializedPage);
    }

    if (!address) {
      setIsLoading(false);
      return;
    }

    const decryptedPage = await decryptPage(initialPage, address);
    const deserializedPage = deserializePage(decryptedPage);
    setPage(deserializedPage);
    setIsLoading(false);
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

  if (isLoading) {
    return (
      <Layout className="pt-20">
        <Skeleton className="mb-8 h-[60px] w-full rounded-lg" />
        <Skeleton className="mb-2 h-[20px] w-full rounded-lg" />
        <Skeleton className="mb-2 h-[20px] w-full rounded-lg" />
        <Skeleton className="mb-2 h-[20px] w-full rounded-lg" />
      </Layout>
    );
  }

  if (!page) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-500">Page not found</h1>
      </div>
    );
  }

  if (isEditing) {
    return (
      <Layout>
        <PageEditor
          page={page}
          renderSubmit={({ isDisabled, data }) => (
            <div className="mb-10 flex gap-4">
              <Button
                onClick={() => updatePageMutation.mutate(data)}
                disabled={isDisabled || updatePageMutation.isLoading}
              >
                {updatePageMutation.isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {updatePageMutation.isLoading ? "Saving..." : "Save page"}
              </Button>
              <Button variant={"ghost"} onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        />
      </Layout>
    );
  }

  const json: JSONContent = {
    type: "doc",
    content: page?.data ?? [],
  };

  return (
    <Layout>
      {isOwner && (
        <div className="mb-10 flex items-end gap-4">
          <Button variant={"outline"} onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit page
          </Button>
          <PublishMenu page={page} />
        </div>
      )}
      <h1 className="mb-8 text-5xl font-bold leading-tight">{page.title}</h1>
      <Viewer json={json} />
    </Layout>
  );
};

export default DocumentPage;
