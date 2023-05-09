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
  const [isEditing, setIsEditing] = useState(false);
  const { address } = useAccount();

  const router = useRouter();

  const PAGE_QUERY_KEY = [
    "DESERIALIZED_PAGE",
    initialPage.id,
    initialPage.key,
    address,
  ];
  const queryClient = useQueryClient();

  const ceramic = useCeramic();

  const { data: page, isLoading } = useQuery<DeserializedPage>(
    PAGE_QUERY_KEY,
    async () => {
      if (!initialPage.key) {
        const deserializedPage = deserializePage(initialPage);
        return deserializedPage;
      }

      if (!address) {
        throw new Error("No address");
      }

      const decryptedPage = await decryptPage(initialPage, address);
      const deserializedPage = deserializePage(decryptedPage);
      return deserializedPage;
    }
  );

  const isOwner = page?.createdBy.id === composeClient.id;

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

      return updateResult;
    },
    {
      onMutate: ({ page }) => {
        trackEvent("Page Save Clicked");

        const previousPage =
          queryClient.getQueryData<DeserializedPage>(PAGE_QUERY_KEY);

        if (previousPage) {
          queryClient.setQueryData<DeserializedPage>(PAGE_QUERY_KEY, {
            ...previousPage,
            title: page.title,
            data: page.content,
          });
        }

        return { previousPage };
      },
      onError: (error, _, context) => {
        console.error("Update Page Error", error);

        if (context?.previousPage) {
          queryClient.setQueryData<DeserializedPage>(
            PAGE_QUERY_KEY,
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

  if (isLoading) {
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
          <PublishMenu page={page} />
          <DeletePageDialog onDelete={deletePageMutation.mutate} />
        </div>
      )}
      <h1 className="mb-8 text-5xl font-bold leading-tight">{page.title}</h1>
      <Viewer key={page.id} json={json} />
    </Layout>
  );
};

export default DocumentPage;
