import { GetServerSideProps, NextPage } from "next";
import { Card } from "../components/Card";
import { getPagesQuery, Page } from "../composedb/page";

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

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {pages.map((page) => (
        <Card key={page.id} page={page} />
      ))}
    </div>
  );
};

export default Page;
