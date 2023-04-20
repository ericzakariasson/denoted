import { DeserializedPage } from "./page-helper";

type Page = {
  page: DeserializedPage;
};

//TODO: add dynamic images

export const formatMetaTags = (page: DeserializedPage) => {
  const defaultMetaTags = {
    description:
      "The universal way to enhance your digital artefacts with on-chain data ✨",
    image: "/social-preview.png",
  };

  const prefixedTitle = page.title ? `${page.title} – denoted` : "denoted";

  return {
    title: prefixedTitle,
    description: page.data[0].text ?? defaultMetaTags.description,
    image: defaultMetaTags.image,
  };
};
