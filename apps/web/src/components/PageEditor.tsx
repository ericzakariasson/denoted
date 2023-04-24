import { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { deserializePage } from "../utils/page-helper";
import { Editor } from "./Editor";

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
  renderSubmit: (props: {
    isDisabled: boolean;
    data: SavePageData;
  }) => React.ReactNode;
};

export function PageEditor({ page, renderSubmit }: PageEditorProps) {
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
  const [focusEditor, setFocusEditor] = useState(false);

  const ceramic = useCeramic();
  const lit = useLit();
  const account = useAccount();

  useEffect(() => {
    const run = async () =>
      setIsCeramicSessionValid(await ceramic.hasSession());
    run();
  }, [ceramic]);

  const isAuthenticated =
    account.isConnected &&
    ceramic.isComposeResourcesSigned &&
    isCeramicSessionValid &&
    lit.isLitAuthenticated;

  const isEnabled =
    isAuthenticated && title.length > 0 && (json?.content ?? []).length > 0;

  const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setFocusEditor(true);
    }
  };

  const AutofocusTitle = () => {
    const callbackRef = useCallback((inputElement: HTMLInputElement) => {
      if (inputElement) {
        inputElement.focus();
      }
    }, []);

    return (
      <input
        ref={callbackRef}
        autoFocus
        placeholder="Untitled"
        className="mb-4 w-full text-5xl font-bold leading-tight placeholder:text-slate-200 focus:outline-none"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onClick={() => setFocusEditor(false)}
        onKeyUp={onEnter}
        required
      />
    );
  };

  return (
    <div>
      {renderSubmit({
        isDisabled: !isEnabled,
        data: {
          page: {
            title,
            content: json?.content ?? [],
          },
          address: account.address as string,
          isPublic: false,
        },
      })}
      <AuthDialog open={!isAuthenticated} />
      <div className="mb-4 flex flex-row justify-between">
        <AutofocusTitle />
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
          focusedEditorState={[focusEditor, setFocusEditor]}
        />
      </div>
    </div>
  );
}
