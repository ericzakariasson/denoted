import { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { NextPage } from "next/types";

import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useAccount } from "wagmi";
import { Editor } from "../components/Editor";
import { createPage } from "../composedb/page";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { trackEvent } from "../lib/analytics";
import { cn } from "../utils/classnames";
import { encryptPage, serializePage } from "../utils/page-helper";

const AuthDialog = dynamic(
  async () =>
    import("../components/AuthDialog").then((module) => module.AuthDialog),
  { ssr: false }
);

const CreatePage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [json, setJson] = useState<JSONContent>();
  const [isCeramicSessionValid, setIsCeramicSessionValid] =
    useState<boolean>(false);

  const ceramic = useCeramic();
  const lit = useLit();
  const account = useAccount();

  useEffect(() => {
    const run = async () =>
      setIsCeramicSessionValid(await ceramic.hasSession());
    run();
  }, [ceramic]);

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
    isCeramicSessionValid &&
    lit.isLitAuthenticated;

  const requiresResourceSignature =
    account.isConnected &&
    lit.isLitAuthenticated &&
    !ceramic.isComposeResourcesSigned;

  const isEnabled =
    isAuthenticated && title.length > 0 && (json?.content ?? []).length > 0;

  return (
    <div>
      <AuthDialog open={!isAuthenticated} />
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
