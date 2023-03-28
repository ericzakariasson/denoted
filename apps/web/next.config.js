/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  async rewrites() {
    return [
      {
        source: "/mp/decide",
        destination: "https://decide.mixpanel.com/decide",
      },
      {
        source: "/mp/:slug",
        // use "api-eu.mixpanel.com" if you need to use EU servers
        destination: "https://api-eu.mixpanel.com/:slug",
      },
    ];
  },
};
