module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `lint`
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
