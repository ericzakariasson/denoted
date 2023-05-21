import { Profile, Publication, Theme } from "@lens-protocol/widgets-react";
import { useQuery } from "react-query";
import { lensClient } from "../../../../lib/lens";
import { DataPill } from "../../../DataPill";

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

export const LensHandleWidget = ({
  handle,
}: Pick<LensWidgetProps, "publicationId" | "handle">) => {
  const profileQuery = useQuery(["PROFILE", handle], async () => {
    const profile = await lensClient.profile.fetch({ handle: handle.replace(".lens", "") + ".lens" });

    if (!profile) {
      throw new Error("No Lens profile found");
    }

    return profile;
  });

  if (profileQuery.isLoading || profileQuery.isIdle || profileQuery.isError) {
    return <DataPill query={profileQuery} />;
  }

  return (
    <Profile
      handle={handle.replace(".lens", "")}
      hideFollowButton={true}
      theme={Theme.dark}
      containerStyle={{ width: "100%" }}
    />
  );
};

export const LensPublicationWidget = ({
  publicationId,
}: Pick<LensWidgetProps, "publicationId" | "handle">) => {
  return (
      <Publication publicationId={publicationId} theme={Theme.dark}/>
  );
};
