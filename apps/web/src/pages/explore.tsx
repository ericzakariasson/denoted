import { GetServerSideProps, NextPage } from "next";
import { Card } from "../components/Card";
import { getPagesQuery, Page } from "../composedb/page";
import { cn } from "../utils/classnames";
import Link from "next/link";
import { trackEvent } from "../lib/analytics";
import { buttonVariants } from "../components/ui/button";

type Props = {
  pages: Page[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const query = await getPagesQuery();
  const pages = query.data?.pageIndex?.edges.map((edge) => edge.node) ?? [];
  const publicPages = pages.filter((page) => !page.key);

  return {
    props: {
      pages: publicPages,
    },
  };
};

const Page: NextPage<Props> = ({ pages }) => {
  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-800">
            No public pages found
          </h1>
          <p className="text-slate-500">
            Be the first to share your knowledge by creating a page
          </p>
        </div>
        <Link
          href="/create"
          className={cn(buttonVariants())}
          onClick={() =>
            trackEvent("Create Page Link Clicked", { from: "/explore" })
          }
        >
          Create page
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {pages.length > 0 && (
        <div>
          <h1 className="mb-4 text-3xl font-bold text-slate-800">
            Public pages
          </h1>{" "}
          <div className="grid gap-4 md:grid-cols-3">
            {pages.map((page) => (
              <Card key={page.id} page={page} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
