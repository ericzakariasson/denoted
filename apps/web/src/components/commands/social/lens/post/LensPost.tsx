import { Publication, Theme } from "@lens-protocol/widgets-react";

export type LensWidgetProps = {
  publicationId: string;
};

export const LensWidget = ({ publicationId }: LensWidgetProps) => {
  return <Publication publicationId={publicationId} theme={Theme.dark} />;
};
