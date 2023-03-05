import { GetServerSideProps, NextPage } from "next";
import { Card } from "../components/Card";
import { getNotesQuery, Note } from "../composedb/note";

type Props = {};

const Page: NextPage<Props> = ({}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex rounded-[64rem] border-8 border-black p-16">
        <span className="text-8xl">/denoted</span>
      </div>
    </div>
  );
};

export default Page;
