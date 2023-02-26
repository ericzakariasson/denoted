# Turborepo starter

This is an official Yarn v1 starter turborepo.

## What's inside?

This turborepo uses [Yarn](https://classic.yarnpkg.com/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `smart-contracts`: a [Hardhat](https://hardhat.org/) project
- `web`: a [Next.js](https://nextjs.org) app
- `ui`: a stub React component library used by both `web` and other potential Next.js applications
- `lint`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `web3-config` : [Typechain] (https://github.com/dethcrypto/TypeChain) configuration containing the smart-contract interface and deployments files
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
yarn run dev
```
