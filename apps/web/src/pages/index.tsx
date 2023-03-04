import { GetServerSideProps, NextPage } from "next";
import { Card } from "../components/Card";
import { getNotesQuery, Note } from "../composedb/note";

type Props = {
  documents: Note[];
};

const IS_DEMO = false;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const query = await getNotesQuery();
  const documents = query.data?.noteIndex?.edges.map((edge) => edge.node) ?? [];

  return {
    props: {
      documents,
    },
  };
};

const Page: NextPage<Props> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-normal text-black">no documents yet</h1>
      </div>
    );
  }

  const docs: Note[] = IS_DEMO
    ? [
        {
          id: "1",
          title: "Gnosos Chain Insights",
          author: { id: "x:x:x:x:0x9768cead8f28bd7aA5e095D4402B8911b8484e7E" },
          createdAt: new Date("2023-03-02").toISOString(),
          content: "",
        },
        {
          id: "2",
          title: "NFT Holdings 2022",
          author: { id: "x:x:x:x:0x9768cead8f28bd7aA5e095D4402B8911b8484e7E" },
          createdAt: new Date("2023-02-12").toISOString(),
          content: "",
        },
        {
          id: "3",
          title: "gm?",
          author: { id: "x:x:x:x:0x9768cead8f28bd7aA5e095D4402B8911b8484e7E" },
          createdAt: new Date("2023-03-04").toISOString(),
          content: "",
        },
      ]
    : documents;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {docs.map((doc) => (
        <Card key={doc.id} doc={doc} />
      ))}
    </div>
  );
};

export default Page;
