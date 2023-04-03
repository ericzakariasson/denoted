import { Publication, Theme } from "@lens-protocol/widgets-react";
import Link from "next/link";
import { useQuery } from "react-query";
import { lensClient } from "../../../../lib/lens";
import { DataPill } from "../../../DataPill"

export type LensWidgetProps = {
  property: "publicationId" | "handle";
  publicationId: string;
  handle: string;
};

export const LensWidget = ({ property, ...props }: LensWidgetProps) => {
  switch (property) {
    case "handle":
      return <LensHandleWidget {...props} />;

    case "publicationId":
      return <LensPublicationWidget {...props} />;
    default:
      return null;
  }
};

export const LensHandleWidget = ({ handle }: Pick<LensWidgetProps, "publicationId" | "handle">) => {
  console.log("handle", handle)
  const query = useQuery(["LENS", "PROFILE", handle], async () => {
    return lensClient.profile.fetch({ handle });
  });

  return (
    <DataPill query={query} className="bg-green-100">
      <Link
        href={`https://lenster.xyz/u/${handle.replace(".lens", "")}`}
        className="no-underline"
        target="_blank"
      >
        🌿
      </Link>{" "}
      {query.data?.name ? `${query.data?.name} (${handle})` : handle}
    </DataPill>
  );
};

export const LensPublicationWidget = ({
  publicationId,
}: Pick<LensWidgetProps, "publicationId" | "handle">) => {
  console.log("publicationId", publicationId)
  return <Publication publicationId={publicationId} theme={Theme.dark} />;
};
