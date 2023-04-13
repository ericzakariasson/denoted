// pages/[pageId].tsx
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { getPageQuery, getPagesQuery } from "../composedb/page";
import { getBaseUrl } from "../utils/base-url";

interface PageData {
  id: string;
  title: string;
  description?: string;
  image?: string;
}

interface PageIdList {
    pageIds: string[];
}

interface MetaTagProps {
  pageData: PageData;
}

const MetaTagPage: React.FC<MetaTagProps> = ({ pageData }) => {
  return (
    <>
      <Head>
        <title>{pageData.title}</title>
        <meta property="og:title" content={pageData.title} />
        <meta property="og:description" content={pageData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${getBaseUrl()}/${pageData.id}`} />
        <meta property="og:image" content={pageData.image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData.title} />
        <meta name="twitter:description" content={pageData.description} />
        <meta name="twitter:url" content={`${getBaseUrl()}/${pageData.id}`} />
        <meta name="twitter:image" content={pageData.image} />
      </Head>
    </>
  );
};

export default MetaTagPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
    if(!params?.pageId) throw new Error("Page ID is required");
    const pageData = await fetchMetaTagData(params.pageId as string);
    return {
      props: {
        pageData,
      },
    };
  };

  export const getStaticPaths: GetStaticPaths = async () => {
    const { pageIds } = await fetchAllPageIds();
  
    const paths = pageIds.map((id) => ({
      params: { pageId: id },
    }));
  
    return {
      paths,
      fallback: true,
    };
  };
  
  async function fetchMetaTagData(pageId: string): Promise<PageData> {
    const query = await getPageQuery(pageId);
    const page = query.data?.node;
  
    if (!page) {
      throw new Error("Page not found");
    }
  
    const pageData: PageData = {
      id: page.id,
      title: page.title,
      description: page.data[0].content,
      image: "Your image URL here",
    };
  
    return pageData;
  }
  
  async function fetchAllPageIds(): Promise<PageIdList> {
    const query = await getPagesQuery()
    const pages = query.data?.pageIndex.edges
    if(!pages) {
        throw new Error("No pages found");

    }
    const pageIds = pages.map(({ node }) => node.id);
    return {
        pageIds,
  }
}