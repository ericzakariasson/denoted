module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@web3auth/web3auth-wagmi-connector"],
  // next.config.js
  experimental: {
    transpilePackages: [
      "@web3auth/web3auth-wagmi-connector",
      "ui",
      "web3-config",
      "merkle",
      "ab-types",
      "subgraph-api",
      "cms-api",
      "locale",
      "utils",
    ],
    esmExternals: "loose",
  },

  externals: {
    "@wagmi/core": "@wagmi/core",
  },
  webpack: (config) => {
    // If a package has node.js dependencies and we want to use it client side webpack breakes. Here we surpass those errors for these packages
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      os: false,
      fs: false,
      tls: false,
      utils: false,
    };

    return config;
  },
};
