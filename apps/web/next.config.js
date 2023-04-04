/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui", "@lens-protocol", "@ipld"],
  async rewrites() {
    return [
      {
        source: "/mp/:slug",
        destination: "https://api-eu.mixpanel.com/:slug",
      },
    ];
  },
};
