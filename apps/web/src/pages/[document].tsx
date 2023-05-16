import { JSONContent } from "@tiptap/react";
import { Edit, Loader2, Router, Save } from "lucide-react";
import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useAccount, useMutation } from "wagmi";
import { Layout } from "../components/Layout";
import { PageEditor, SavePageData } from "../components/PageEditor";
import { Viewer } from "../components/Viewer";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { Page, getPageQuery, updatePage } from "../composedb/page";
import { trackEvent } from "../lib/analytics";
import { composeClient } from "../lib/compose";
import {
  DeserializedPage,
  decryptPage,
  deletePage,
  deserializePage,
  encryptPage,
  serializePage,
  importStoredEncryptionKey,
} from "../utils/page-helper";
import { DeletePageDialog } from "../components/DeletePageDialog";
import { useRouter } from "next/router";
import { toast } from "../components/ui/use-toast";
import { useCeramic } from "../hooks/useCeramic";

const PublishMenu = dynamic(
  async () =>
    import("../components/PublishMenu").then((module) => module.PublishMenu),
  { ssr: false }
);

type Props = {
  page: Page;
};

const DocumentPage: NextPage<Props> = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { address } = useAccount();

  const router = useRouter();

  const queryClient = useQueryClient();

  const ceramic = useCeramic();

  const pageId = router.query.document?.toString() ?? "";

  const pageQuery = useQuery(
    [pageId],
    async () => {
      const { data } = await getPageQuery(pageId);
      return data?.node;
    },
    { enabled: Boolean(pageId) }
  );

  const DESERIALIZED_PAGE_QUERY_KEY = [
    "DESERIALIZED_PAGE",
    pageQuery.data?.id,
    pageQuery.data?.key,
    address,
  ];

  const { data, isLoading } = useQuery<{
    page: DeserializedPage;
    key?: CryptoKey;
  }>(
    DESERIALIZED_PAGE_QUERY_KEY,
    async () => {
      const serializedPage = pageQuery.data!;
      if (!serializedPage.key) {
        const deserializedPage = deserializePage(serializedPage);
        return { page: deserializedPage };
      }

      if (!address) {
        throw new Error("No address");
      }

      const { key } = await importStoredEncryptionKey(
        serializedPage.key!,
        address
      );

      const decryptedPage = await decryptPage(serializedPage, key);
      const deserializedPage = deserializePage(decryptedPage);

      return {
        page: deserializedPage,
        key,
      };
    },
    { enabled: pageQuery.isSuccess }
  );

  const page = data?.page;
  const key = data?.key;

  const isOwner = page?.createdBy.id === composeClient.id;

  const updatePageMutation = useMutation(
    async ({
      page: updatedPage,
      address,
      isPublic,
      encryptionKey,
    }: SavePageData) => {
      const pageInput = serializePage(
        "PAGE",
        updatedPage.title,
        updatedPage.content,
        new Date()
      );

      if (!address || !encryptionKey) {
        throw new Error("No user address or encryption key");
      }

      const updateResult = await updatePage(
        page!.id,
        isPublic
          ? pageInput
          : await encryptPage(pageInput, address, encryptionKey)
      );

      return updateResult;
    },
    {
      onMutate: ({ page }) => {
        trackEvent("Page Save Clicked");

        const previousPage = queryClient.getQueryData<DeserializedPage>(
          DESERIALIZED_PAGE_QUERY_KEY
        );

        if (previousPage) {
          queryClient.setQueryData<DeserializedPage>(
            DESERIALIZED_PAGE_QUERY_KEY,
            {
              ...previousPage,
              title: page.title,
              data: page.content,
            }
          );
        }

        return { previousPage };
      },
      onError: (error, _, context) => {
        console.error("Update Page Error", error);

        if (context?.previousPage) {
          queryClient.setQueryData<DeserializedPage>(
            DESERIALIZED_PAGE_QUERY_KEY,
            context.previousPage
          );
        }
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

  const deletePageMutation = useMutation(
    async () => {
      const ceramicSession = await ceramic.getSession();

      try {
        const response = await fetch("/api/page/unpublish", {
          method: "POST",
          body: JSON.stringify({
            pageId: page!.id,
            ceramicSession: ceramicSession?.serialize(),
          }),
        });

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        await response.json();
      } catch (error) {
        throw new Error("Unpublish Error", { cause: error });
      }

      try {
        trackEvent("Page Unpublished");
        return await deletePage(page!.id);
      } catch (error) {
        throw new Error("Delete Error", { cause: error });
      }
    },
    {
      onMutate: () => {
        trackEvent("Page Delete Clicked");
      },
      onSuccess: async ({ data, errors }) => {
        console.info("Delete Page Success", data, errors);

        const page = data?.updatePage?.document ?? null;

        if (page) {
          queryClient.invalidateQueries({
            queryKey: ["PAGES", composeClient.id],
          });
          trackEvent("Page Deleted", { pageId: page!.id });

          router.push("/create");

          toast({
            title: "Page deleted ✔️",
            description:
              "Your page has been deleted but is still accessible on IPFS if it was published.",
          });
        }
      },
    }
  );

  if (isLoading || pageQuery.isLoading) {
    return (
      <Layout className="pt-20" title="Loading...">
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
          encryptionKey={key}
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
    <Layout title={page.title}>
      {isOwner && (
        <div className="mb-10 flex items-end gap-4">
          <Button
            variant={"outline"}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit page
          </Button>
          <PublishMenu page={page} encryptionKey={key} />
          <DeletePageDialog onDelete={deletePageMutation.mutate} />
        </div>
      )}
      <h1 className="mb-8 text-5xl font-bold leading-tight">{page.title}</h1>
      <Viewer key={page.id} encryptionKey={key} json={json} />
    </Layout>
  );
};

export default DocumentPage;
