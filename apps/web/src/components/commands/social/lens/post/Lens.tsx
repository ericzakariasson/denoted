import { Publication, Theme } from "@lens-protocol/widgets-react";

export type LensWidgetProps = {
  publicationId: string;
};

export const LensWidget = ({ publicationId }: LensWidgetProps) => {
  console.log({ publicationId})
  return <Publication publicationId={publicationId} theme={Theme.light} />;
};
