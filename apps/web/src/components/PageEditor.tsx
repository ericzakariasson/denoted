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
import TextareaAutosize from "react-textarea-autosize";
import { usePageEditor } from "../hooks/usePageEditor";

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
  address?: string;
  encryptionKey?: CryptoKey;
};

type PageEditorProps = {
  page?: ReturnType<typeof deserializePage>;
  encryptionKey?: CryptoKey;
  renderSubmit: (props: {
    isDisabled: boolean;
    getData: () => SavePageData;
  }) => React.ReactNode;
  mode: "CREATE" | "UPDATE";
};

export function PageEditor({
  page,
  encryptionKey,
  renderSubmit,
  mode,
}: PageEditorProps) {
  const [title, setTitle] = useState(page?.title ?? "");

  const titleRef = useRef<HTMLTextAreaElement>(null);

  const { editor } = usePageEditor({
    content: page
      ? {
          type: "doc",
          content: page.data ?? [],
        }
      : undefined,
    encryptionKey,
  });

  const ceramic = useCeramic();
  const lit = useLit();
  const account = useAccount();

  useEffect(() => {
    if (mode === "CREATE") {
      titleRef.current?.focus();
    }

    if (mode === "UPDATE") {
      editor?.commands.focus("end");
    }
  }, [mode, editor]);

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

  const isEnabled = isAuthenticated && title.length > 0 && !editor?.isEmpty;

  const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      editor?.commands.focus();
      return false;
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
          getData: () => ({
            page: {
              title,
              content: editor?.getJSON().content ?? [],
            },
            address: account.address,
            encryptionKey,
          }),
        })}
        <AuthDialog open={!isLoading && !isAuthenticated} />
        <TextareaAutosize
          ref={titleRef}
          placeholder="Untitled"
          className="mb-8 w-full resize-none text-5xl font-bold leading-tight placeholder:text-slate-200 focus:outline-none"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={onEnter}
          required
        />
        {editor && <Editor className="flex-grow" editor={editor} />}
      </div>
    </>
  );
}
