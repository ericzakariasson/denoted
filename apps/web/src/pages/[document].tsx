import { GetServerSideProps, NextPage } from "next/types";
import { ReactNode, useState } from "react";
import { TextMatcher } from "../components/TextMatcher";

type Props = {
  id: string;
  title: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const documentId = ctx.params?.document?.toString();

  if (!documentId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id: documentId,
      title: "foo",
    },
  };
};

const DocumentPage: NextPage<Props> = ({ id, title }) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <input
        className="border"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <div className="bg-slate-100 p-4">
        <TextMatcher text={value} />
      </div>
    </div>
  );
};

export default DocumentPage;
