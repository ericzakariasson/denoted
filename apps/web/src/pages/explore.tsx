import { GetServerSideProps, NextPage } from "next";
import { Card } from "../components/Card";
import { getPagesQuery, Page } from "../composedb/page";

type Props = {
  documents: Page[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const query = await getPagesQuery();
  const documents = query.data?.pageIndex?.edges.map((edge) => edge.node) ?? [];

  return {
    props: {
      documents,
    },
  };
};

const Page: NextPage<Props> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div className="rounded-2xl bg-gray-100 p-8">
        <h1 className="text-center text-lg font-normal text-gray-500">
          no documents
        </h1>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {documents.map((doc) => (
        <Card key={doc.id} doc={doc} />
      ))}
    </div>
  );
};

export default Page;
