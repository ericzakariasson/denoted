import { GetServerSideProps, NextPage } from "next/types";
import { ReactNode, useState } from "react";
import { TextMatcher } from "../components/TextMatcher";

import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { TokenHoldersWidget } from "../components/widgets/Token";

type Props = {
  id: string;
  title: string;
  mdx: MDXRemoteSerializeResult;
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
      id: documentId,
      title: "foo",
      mdx: mdxSource,
    },
  };
};

const DocumentPage: NextPage<Props> = ({ id, title, mdx }) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <input
        className="border"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <div className="bg-slate-100 p-4">
        <TextMatcher text={value} />
        <MDXRemote {...mdx} components={components} />
      </div>
    </div>
  );
};

export default DocumentPage;
