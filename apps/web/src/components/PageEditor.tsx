import { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { deserializePage } from "../utils/page-helper";
import { Editor } from "./Editor";
import { useRouter } from "next/router";

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
  autofocusProp?: boolean;
  page?: ReturnType<typeof deserializePage>;
  renderSubmit: (props: {
    isDisabled: boolean;
    data: SavePageData;
  }) => React.ReactNode;
};

export function PageEditor({ page, renderSubmit, autofocusProp }: PageEditorProps) {
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
  
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { query } = router;
  const autofocusQuery = query.autofocus === "true";

  const autofocusTitle = autofocusQuery || autofocusProp;

  useEffect(() => {
    if (autofocusTitle && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autofocusTitle])

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
      <input
        ref={inputRef}
        placeholder="Untitled"
        className="mb-8 w-full text-5xl font-bold leading-tight placeholder:text-slate-200 focus:outline-none"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onClick={() => setFocusEditor(false)}
        onKeyUp={onEnter}
        required
      />
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
