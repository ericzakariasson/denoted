import { GetServerSideProps, NextPage } from "next/types";

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
  return (
    <div>
      {id}
      {title}
    </div>
  );
};

export default DocumentPage;
