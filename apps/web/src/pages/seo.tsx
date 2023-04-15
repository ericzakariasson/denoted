// import { useRouter } from "next/router";
// import { getBaseUrl } from "../utils/base-url";
// import { deserializePage } from "../utils/page-helper";

// type Page = {
//   page: ReturnType<typeof deserializePage>;
// };
// export const Seo = ({ page }: Page) => {
//   const defaultMetaTags = {
//     description:
//       "setup your web3 profile and connect with others by turning your social tokens into social signals.",
//     image: "https://images.unsplash.com/photo-156",
//   };

//   const { asPath } = useRouter();
//   const origin = getBaseUrl();

//   const prefixedTitle = page.title ? `denoted/${page.title}` : "denoted";
//   console.log({ asPath, origin })
//   const metaTags = {
//     id: page.id ?? "",
//     title: prefixedTitle,
//     description: page.data[0].text ?? defaultMetaTags.description,
//     image: "https://images.unsplash.com/photo-156",
//   };
//   return (
//     <>
//       <meta
//         name="keywords"
//         content="web3, web3 document, web3 knowledge management, web3 data, web3 analytics, web3 documents, web3 onchain data, web3 sharing, web3 content, blockchain analytics, blockchain writing"
//       />
//       <meta name="robots" content="index, follow" />
//       <title>{prefixedTitle}</title>

//       {/* open graph */}

//       <meta property="og:title" content={prefixedTitle} />
//       <meta property="og:description" content={metaTags.description} />
//       <meta property="og:type" content="website" />
//       <meta property="og:url" content={origin + asPath} />
//       <meta property="og:image" content={metaTags.image} />

//       {/*twitter */}

//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:title" content={metaTags.title} />
//       <meta name="twitter:description" content={metaTags.description} />
//       <meta name="twitter:url" content={origin + asPath} />
//       <meta name="twitter:image" content={metaTags.image} />
//     </>
//   );
// };
