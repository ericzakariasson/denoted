import { GetServerSideProps, NextPage } from "next";
import { supabase } from "../../lib/supabase/supabase";
import { formatMetaTags } from "../../utils/metatags";
import { DeserializedPage } from "../../utils/page-helper";
import Head from "next/head";
import { JSONContent } from "@tiptap/react";
import { Viewer } from "../../components/Viewer";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { Logo } from "../../components/Logo";
import { buttonVariants } from "../../components/ui/button";
import { Avatar } from "connectkit";
import { Address, useEnsName } from "wagmi";
import TimeAgo from "react-timeago";
import { ExternalLink } from "lucide-react";
import { Badge } from "../../components/ui/badge";

type Props = {
  page: DeserializedPage;
  url: string;
  cid: string;
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
      cid: data.ipfs_cid,
    },
  };
};

const DocumentPage: NextPage<Props> = ({ page, url, cid }) => {
  const metaTags = formatMetaTags(page);

  const createdByAddress = page.createdBy.id.split(":")[4] as Address;

  const ens = useEnsName({
    address: createdByAddress,
  });

  const json: JSONContent = {
    type: "doc",
    content: page?.data ?? [],
  };

  return (
    <div className={cn("m-auto max-w-2xl p-4")}>
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
      <header className="mb-16 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <Link
          href={"/create"}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Create page
          <ExternalLink className="ml-2 h-4 w-4" />
        </Link>
      </header>
      <div className="mb-6 flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Avatar address={createdByAddress} size={24} />
            <p className="text-slate-600">
              {ens.data ? ens.data : createdByAddress}
            </p>
          </div>
          <TimeAgo className="text-slate-400" date={page.createdAt} />
        </div>
        <Badge className="text-xs text-slate-500" variant={"outline"}>
          ipfs:
          <Link
            target="_blank"
            href={`https://cloudflare-ipfs.com/ipfs/${cid}`}
          >
            {cid}
          </Link>
        </Badge>
      </div>
      <h1 className="mb-8 text-5xl font-bold break-words">{page.title}</h1>
      <Viewer key={page.id} json={json} />
    </div>
  );
};

export default DocumentPage;
