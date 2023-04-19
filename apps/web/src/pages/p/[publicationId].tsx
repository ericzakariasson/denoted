import { GetServerSideProps, NextPage } from "next";
import { supabase } from "../../lib/supabase/supabase";
import { formatMetaTags } from "../../utils/metatags";
import { DeserializedPage } from "../../utils/page-helper";
import Head from "next/head";
import { JSONContent } from "@tiptap/react";
import { Viewer } from "../../components/Viewer";

type Props = {
  page: DeserializedPage;
  url: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const publicationId = ctx.params?.publicationId?.toString();

  if (!publicationId) {
    return {
      notFound: true,
    };
  }

  const { data, error } = await supabase
    .from("page_publication")
    .select("*")
    .eq("id", publicationId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  if (!data) {
    return {
      notFound: true,
    };
  }
  const response = await fetch(
    `https://cloudflare-ipfs.com/ipfs/${data.ipfs_cid}`
  );

  const page = await response.json();

  const url = ctx.req.headers.host + ctx.resolvedUrl;

  return {
    props: {
      page,
      url,
    },
  };
};

const DocumentPage: NextPage<Props> = ({ page, url }) => {
  const metaTags = formatMetaTags({ page });

  const json: JSONContent = {
    type: "doc",
    content: page?.data ?? [],
  };

  return (
    <div>
      <Head>
        <meta
          name="keywords"
          content="web3, web3 document, web3 knowledge management, web3 data, web3 analytics, web3 documents, web3 onchain data, web3 sharing, web3 content, blockchain analytics, blockchain writing"
        />
        <meta name="robots" content="index, follow" />
        <title>{metaTags.title}</title>

        {/* open graph */}

        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={metaTags.image} />

        {/*twitter */}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.title} />
        <meta name="twitter:description" content={metaTags.description} />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:image" content={metaTags.image} />
      </Head>
      <div className="flex items-start justify-between">
        <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      </div>
      <Viewer key={page.id} json={json} />
    </div>
  );
};

export default DocumentPage;
