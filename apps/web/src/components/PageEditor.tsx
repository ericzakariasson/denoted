import { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { cn } from "../utils/classnames";
import { deserializePage } from "../utils/page-helper";
import { Editor } from "./Editor";
import { Button } from "./ui/button";
import { Save, Loader2 } from "lucide-react";

const AuthDialog = dynamic(
  async () =>
    import("../components/AuthDialog").then((module) => module.AuthDialog),
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
      <div className="mb-4 flex flex-row justify-between">
        <input
          placeholder="Untitled"
          className="mb-4 w-full text-5xl font-bold placeholder:text-slate-200 focus:outline-none"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
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
      <div className="fixed bottom-0 py-4">
        <Button onClick={() => handleSave()} disabled={!isEnabled || isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save page"}
        </Button>
      </div>
    </div>
  );
}
