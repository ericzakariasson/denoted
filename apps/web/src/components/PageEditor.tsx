import { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { cn } from "../utils/classnames";
import {
  deserializePage,
} from "../utils/page-helper";
import { Editor } from "./Editor";

const AuthDialog = dynamic(
  async () =>
    import("../components/AuthDialog").then((module) => module.AuthDialog),
  { ssr: false }
);

const PublishMenu = dynamic(
  async () =>
    import("./PublishMenu").then((module) => module.PublishMenu),
  { ssr: false }
);

export type SavePageData = {
  page: {
    title: string;
    content: JSONContent[];
  };
  address: string;
  isPublic: boolean;
};

type PageEditorProps = {
  page?: ReturnType<typeof deserializePage>;
  onSave: (data: SavePageData) => void;
  isSaving: boolean;
};

export function PageEditor({ page, onSave, isSaving }: PageEditorProps) {
  const [title, setTitle] = useState(page?.title ?? "");
  const [json, setJson] = useState<JSONContent>(
    page
      ? {
          type: "doc",
          content: page.data ?? [],
        }
      : []
  );

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

  function handleSave() {
    onSave({
      page: {
        title,
        content: json?.content ?? [],
      },
      address: account.address as string,
      isPublic: false,
    });
  }

  const isAuthenticated =
    account.isConnected &&
    ceramic.isComposeResourcesSigned &&
    isCeramicSessionValid &&
    lit.isLitAuthenticated;

  const isEnabled =
    isAuthenticated && title.length > 0 && (json?.content ?? []).length > 0;
  return (
    <div>
      <AuthDialog open={!isAuthenticated} />
      <div className="flex flex-row justify-between mb-4">
        <input
          placeholder="Untitled"
          className="mb-4 w-full text-5xl font-bold placeholder:text-gray-200 focus:outline-none"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        {page && <PublishMenu title={page.title} />}
      </div>
      <div>
        <Editor
          initialContent={
            page
              ? {
                  type: "doc",
                  content: page.data ?? [],
                }
              : []
          }
          onUpdate={(json) => setJson(json)}
        />
      </div>
      <button
        className={cn(
          "rounded-xl from-gray-700 to-gray-900 px-6 py-3 leading-tight text-white enabled:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] enabled:shadow-md disabled:bg-gray-300"
        )}
        onClick={() => handleSave()}
        disabled={!isEnabled}
      >
        {isSaving ? "Saving..." : "Save page"}
      </button>
    </div>
  );
}
