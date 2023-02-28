import { GetServerSideProps, NextPage } from "next/types";
import { ReactNode, useRef, useState } from "react";
import { TextMatcher } from "../components/TextMatcher";

import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { TokenHoldersWidget } from "../components/widgets/Token";

type Props = {
  doc: {
    id: string;
    title: string;
    mdx: MDXRemoteSerializeResult;
  };
  isEditor: boolean;
};

const components = { TokenHoldersWidget };

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const documentId = ctx.params?.document?.toString();

  if (!documentId) {
    return {
      notFound: true,
    };
  }

  const source = `
  We currently have **<TokenHoldersWidget address="0x0" chain="1" />** holders for our token.
  `;
  const mdxSource = await serialize(source);

  return {
    props: {
      isEditor: true,
      doc: {
        id: documentId,
        title: "foo",
        mdx: mdxSource,
      },
    },
  };
};

const DocumentPage: NextPage<Props> = ({ doc, isEditor }) => {
  const [title, setTitle] = useState(doc.title);
  const [isEditing, setIsEditing] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-32">
      <div className="flex justify-between">
        {isEditing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setIsEditing(false);
            }}
          >
            <input
              placeholder="Untitled"
              className="text-8xl"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              ref={titleInputRef}
            />
          </form>
        ) : (
          <h1
            className="text-8xl"
            onDoubleClick={() => {
              setIsEditing(true);
              setTimeout(() => titleInputRef.current?.focus(), 0);
            }}
          >
            {title}
          </h1>
        )}
        {isEditor && !isEditing && (
          <button onClick={() => setIsEditing(true)}>edit</button>
        )}
        {isEditor && isEditing && (
          <button onClick={() => setIsEditing(false)}>save</button>
        )}
      </div>
      <div className="bg-slate-100 p-4">
        <MDXRemote {...doc.mdx} components={components} />
      </div>
    </div>
  );
};

export default DocumentPage;
