import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { PageCard } from "../components/PageCard";
import { buttonVariants } from "../components/ui/button";
import { trackEvent } from "../lib/analytics";
import { supabase } from "../lib/supabase/supabase";
import { Database } from "../lib/supabase/supabase.types";
import { cn } from "../utils/classnames";
import { Layout } from "../components/Layout";

type Props = {
  pagePublications: Database["public"]["Tables"]["page_publication"]["Row"][];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data, error } = await supabase.from("page_publication").select("*");

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

  return {
    props: {
      pagePublications: data,
    },
  };
};

const Page: NextPage<Props> = ({ pagePublications }) => {
  if (pagePublications.length === 0) {
    return (
      <Layout className="flex flex-col items-start gap-4 pt-3.5">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-800">
            No public pages found
          </h1>
          <p className="text-slate-500">
            Be the first to share your knowledge by creating a page
          </p>
        </div>
        <Link
          href={{ pathname: "/create", query: { autofocus: true } }}
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
    <Layout className="flex flex-col gap-8 pt-3.5">
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
