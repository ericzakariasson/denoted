import { GetServerSideProps, NextPage } from "next";
import { Card } from "../components/Card";
import { getPagesQuery, Page } from "../composedb/page";
import { composeClient } from "../lib/compose";

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
      <div className="rounded-2xl bg-gray-100 p-8">
        <h1 className="text-center text-lg font-normal text-gray-500">
          no pages
        </h1>
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
