import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useMutation, useQueryClient } from "react-query";

import { PageEditor, SavePageData } from "../components/PageEditor";
import { createPage } from "../composedb/page";
import { trackEvent } from "../lib/analytics";
import { composeClient } from "../lib/compose";
import { encryptPage, serializePage } from "../utils/page-helper";

const CreatePage: NextPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createPageMutation = useMutation(
    async ({ page, address, isPublic }: SavePageData) => {
      const pageInput = serializePage(
        "PAGE",
        page.title,
        page.content,
        new Date()
      );

      return await createPage(
        isPublic ? pageInput : await encryptPage(pageInput, address)
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
  return (
    <PageEditor
      onSave={createPageMutation.mutate}
      isSaving={createPageMutation.isLoading}
    />
  );
};

export default CreatePage;
