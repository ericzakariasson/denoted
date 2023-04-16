import { deserializePage } from "./page-helper";

type Page = {
  page: ReturnType<typeof deserializePage>;
};

//TODO: add dynamic images

export const formatMetaTags = ({ page }: Page) => {
  const defaultMetaTags = {
    description:
      "setup your web3 profile and connect with others by turning your social tokens into social signals.",
    image: "https://images.unsplash.com/photo-156",
  };

  const prefixedTitle = page.title ? `denoted/${page.title}` : "denoted";

  return {
    id: page.id ?? "",
    title: prefixedTitle,
    description: page.data[0].text ?? defaultMetaTags.description,
    image: "https://images.unsplash.com/photo-156",
  };
};
