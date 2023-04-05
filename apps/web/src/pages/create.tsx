import { JSONContent } from "@tiptap/react";
import { useRouter } from "next/router";
import { NextPage } from "next/types";

import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useAccount } from "wagmi";
import { Editor } from "../components/Editor";
import { createPage } from "../composedb/page";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { cn } from "../utils/classnames";
import { encryptPage, serializePage } from "../utils/page-helper";
import { trackEvent } from "../lib/analytics";
import { AuthSteps } from "../components/AuthSteps";
import * as Dialog from "@radix-ui/react-dialog";

const CreatePage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [json, setJson] = useState<JSONContent>();

  const ceramic = useCeramic();
  const lit = useLit();
  const account = useAccount();

  const router = useRouter();

  const savePageMutation = useMutation(
    async () => {
      const pageInput = serializePage(
        "PAGE",
        title,
        json?.content ?? [],
        new Date()
      );

      const encryptedPageInput = await encryptPage(pageInput, account.address!);
      return await createPage(encryptedPageInput);
    },
    {
      onMutate: () => trackEvent("Page Save Clicked"),
      onError: (error) => {
        console.error("Create error", error);
      },
      onSuccess: async ({ data, errors }) => {
        console.log("create", data, errors);

        const id = data?.createPage?.document?.id ?? null;
        if (id) {
          trackEvent("Page Saved", { pageId: id });
          router.push(id);
        }
      },
    }
  );

  const isAuthenticated =
    account.isConnected &&
    ceramic.isComposeResourcesSigned &&
    lit.isLitAuthenticated;

  const requiresResourceSignature =
    account.isConnected &&
    lit.isLitAuthenticated &&
    !ceramic.isComposeResourcesSigned;

  const isEnabled =
    isAuthenticated && title.length > 0 && (json?.content ?? []).length > 0;

  return (
    <div>
      {requiresResourceSignature && (
        <div className="mb-8 flex flex-col items-start gap-4 rounded-2xl border p-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium ">Updated model</h2>
            <p className="text-gray-600">
              We have updated the storage model, please sign again in order to
              save your page
            </p>
          </div>

          <button
            className={cn(
              "rounded-xl from-gray-700 to-gray-900 px-6 py-3 leading-tight text-white enabled:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] enabled:shadow-md disabled:bg-gray-300"
            )}
            onClick={() => ceramic.authenticate()}
          >
            Sign message
          </button>
        </div>
      )}

      <Dialog.Root open={!isAuthenticated} modal={false}>
        <Dialog.Portal>
          <Dialog.Content className="fixed top-[50%] left-[50%] mx-auto max-w-3xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-8 shadow-lg ">
            <Dialog.Title className="text-3xl font-bold text-gray-800">
              Setup account
            </Dialog.Title>
            <Dialog.Close />
            <AuthSteps />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="mb-4">
        <input
          placeholder="Untitled"
          className="mb-4 w-full text-5xl font-bold placeholder:text-gray-200 focus:outline-none"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <Editor onUpdate={(json) => setJson(json)} />
      </div>
      <button
        className={cn(
          "rounded-xl from-gray-700 to-gray-900 px-6 py-3 leading-tight text-white enabled:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] enabled:shadow-md disabled:bg-gray-300"
        )}
        onClick={() => savePageMutation.mutate()}
        disabled={!isEnabled}
      >
        {savePageMutation.isLoading ? "Saving..." : "Save page"}
      </button>
    </div>
  );
};

export default CreatePage;
