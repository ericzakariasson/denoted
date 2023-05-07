import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useMutation, useQueryClient } from "react-query";

import { PageEditor, SavePageData } from "../components/PageEditor";
import { createPage } from "../composedb/page";
import { trackEvent } from "../lib/analytics";
import { composeClient } from "../lib/compose";
import { encryptPage, serializePage } from "../utils/page-helper";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Loader2, Save } from "lucide-react";
import { generateEncryptionKey } from "../lib/crypto";
import { useEffect } from "react";

const CreatePage: NextPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const generateKeyMutation = useMutation(
    async () => {
      const key = await generateEncryptionKey();
      console.log("Generated key", new Uint8Array(await crypto.subtle.exportKey("raw", key)))
      return key;
    },
  );

  const createPageMutation = useMutation(
    async ({ page, address, encryptionKey, isPublic }: SavePageData) => {
      const pageInput = serializePage(
        "PAGE",
        page.title,
        page.content,
        new Date()
      );

      if (!address || !encryptionKey) {
        throw new Error("No user address or encryption key");
      }

      return await createPage(
        isPublic ? pageInput : await encryptPage(pageInput, address, encryptionKey)
      );
    },
    {
      onMutate: () => trackEvent("Page Save Clicked"),
      onError: (error) => {
        console.error("Create Page Error", error);
      },
      onSuccess: async ({ data, errors }) => {
        console.info("Create Page Success", data, errors);

        const id = data?.createPage?.document?.id ?? null;

        if (id) {
          queryClient.refetchQueries({
            queryKey: ["PAGES", composeClient.id],
          });
          trackEvent("Page Saved", { pageId: id });
          router.push(id);
        }
      },
    }
  );

  useEffect(() => {
    if (generateKeyMutation.isIdle) {
      generateKeyMutation.mutate();
    }
  }, [generateKeyMutation]);

  return (
    <Layout>
      <PageEditor
        encryptionKey={generateKeyMutation.data}
        renderSubmit={({ isDisabled, data }) => (
          <div className="mb-10 flex gap-4">
            <Button
              onClick={() => createPageMutation.mutate(data)}
              disabled={isDisabled || createPageMutation.isLoading}
            >
              {createPageMutation.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {createPageMutation.isLoading ? "Saving..." : "Save page"}
            </Button>
          </div>
        )}
      />
    </Layout>
  );
};

export default CreatePage;
