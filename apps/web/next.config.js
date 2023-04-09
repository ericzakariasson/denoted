/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui", "@lens-protocol"],
  async rewrites() {
    return [
      {
        source: "/mp/:slug",
        destination: "https://api-eu.mixpanel.com/:slug",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        port: '',
        pathname: '/coins/images/**',
      },
    ],
  },  
};
