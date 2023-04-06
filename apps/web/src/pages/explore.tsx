import { GetServerSideProps, NextPage } from "next";
import { Card } from "../components/Card";
import { getPagesQuery, Page } from "../composedb/page";
import { composeClient } from "../lib/compose";
import { cn } from "../utils/classnames";
import Link from "next/link";
import { trackEvent } from "../lib/analytics";

type Props = {
  pages: Page[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const query = await getPagesQuery();
  const pages = query.data?.pageIndex?.edges.map((edge) => edge.node) ?? [];

  return {
    props: {
      pages,
    },
  };
};

const Page: NextPage<Props> = ({ pages }) => {
  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-800">
            No public pages found
          </h1>
          <p className="text-gray-500">
            Be the first to share your knowledge by creating a page
          </p>
        </div>
        <Link
          href="/create"
          className={cn(
            "rounded-xl bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-gray-700 to-gray-900 px-6 py-3 leading-tight text-white shadow-md"
          )}
          onClick={() =>
            trackEvent("Create Page Link Clicked", { from: "/explore" })
          }
        >
          Create page {"->"}
        </Link>
      </div>
    );
  }

  const publicPages = pages.filter((page) => !page.key);
  const myPages = pages.filter(
    (page) => page.createdBy.id === composeClient.id
  );

  return (
    <div className="flex flex-col gap-8">
      {myPages.length > 0 && (
        <div>
          <h1 className="mb-4 text-xl">My pages</h1>
          <div className="grid gap-4 md:grid-cols-3">
            {myPages.map((page) => (
              <Card key={page.id} page={page} />
            ))}
          </div>
        </div>
      )}
      {publicPages.length > 0 && (
        <div>
          <h1 className="mb-4 text-xl">Public page</h1>
          <div className="grid gap-4 md:grid-cols-3">
            {publicPages.map((page) => (
              <Card key={page.id} page={page} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
