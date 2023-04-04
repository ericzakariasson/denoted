import { Publication, Profile, Theme } from "@lens-protocol/widgets-react";

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
  return (
    <Profile
      handle={handle.replace(".lens", "")}
      hideFollowButton={true}
      theme={Theme.dark}
    />
  );
};

export const LensPublicationWidget = ({
  publicationId,
}: Pick<LensWidgetProps, "publicationId" | "handle">) => {
  return <Publication publicationId={publicationId} theme={Theme.light} />;
};
