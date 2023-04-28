import { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { deserializePage } from "../utils/page-helper";
import { Editor } from "./Editor";
import { useQuery } from "react-query";
import Head from "next/head";
import { formatTitle } from "./Layout";

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

  const [focusEditor, setFocusEditor] = useState(false);

  const ceramic = useCeramic();
  const lit = useLit();
  const account = useAccount();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const ceramicSessionQuery = useQuery(
    [],
    async () => await ceramic.hasSession(),
    { cacheTime: 0 }
  );

  const isLoading =
    account.isConnecting ||
    ceramic.isLoading ||
    lit.isLoading ||
    ceramicSessionQuery.isLoading;

  const isAuthenticated =
    account.isConnected &&
    ceramic.isComposeResourcesSigned &&
    ceramicSessionQuery.data &&
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
    <>
      <Head>
        <title>{formatTitle(title)}</title>
      </Head>
      <div className="flex h-full flex-col">
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
        <AuthDialog open={!isLoading && !isAuthenticated} />
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
        <Editor
          className="flex-grow"
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
    </>
  );
}
