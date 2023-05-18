import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { PageCard } from "../components/PageCard";
import { buttonVariants } from "../components/ui/button";
import { trackEvent } from "../lib/analytics";
import { supabase } from "../lib/supabase/supabase";
import { Database } from "../lib/supabase/supabase.types";
import { cn } from "../utils/classnames";
import { Layout } from "../components/Layout";
import * as Sentry from "@sentry/nextjs";

type PagePublication = Database["public"]["Tables"]["page_publication"]["Row"];

type Props = {
  pagePublications: PagePublication[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data, error } = await supabase
    .from("page_publication")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    Sentry.captureException(error);
    console.error(error);
    return {
      notFound: true,
    };
  }

  if (!data) {
    return {
      props: {
        pagePublications: [],
      },
    };
  }

  const lastestPagePublicationMap = data.reduce((map, publication) => {
    if (!map.has(publication.page_id)) {
      map.set(publication.page_id, publication);
    }
    return map;
  }, new Map<string, PagePublication>());

  const pagePublications = Array.from(lastestPagePublicationMap.values());

  return {
    props: {
      pagePublications,
    },
  };
};

const Page: NextPage<Props> = ({ pagePublications }) => {
  if (pagePublications.length === 0) {
    return (
      <Layout
        className="flex flex-col items-start gap-4 pt-3.5"
        title="explore"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-800">
            No public pages found
          </h1>
          <p className="text-slate-500">
            Be the first to share your knowledge by creating a page
          </p>
        </div>
        <Link
          href={{ pathname: "/create" }}
          className={cn(buttonVariants())}
          onClick={() =>
            trackEvent("Create Page Link Clicked", { from: "/explore" })
          }
        >
          Create page
        </Link>
      </Layout>
    );
  }

  return (
    <Layout className="flex flex-col gap-8 pt-3.5" title="explore">
      {pagePublications.length > 0 && (
        <div>
          <h1 className="mb-4 text-3xl font-bold text-slate-800">
            Public pages
          </h1>
          <div className="grid grid-cols-2 gap-4">
            {pagePublications.map((publication) => (
              <PageCard key={publication.id} publication={publication} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Page;
