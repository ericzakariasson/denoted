import Link from "next/link";
import { useQuery } from "react-query";
import { getNotesQuery } from "../composedb/note";
import { composeClient } from "../lib/compose";

export const DocumentList = () => {
  const { data } = useQuery("posts", async () => {
    const query = await getNotesQuery();
    return query.data?.edges;
  });

  return (
    <section>
      {data?.map((edge) => (
        <article key={edge.node.id}>
          <Link href={edge.node.id}>{edge.node.id}</Link>
        </article>
      ))}
    </section>
  );
};
