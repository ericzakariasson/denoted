# denoted

**A knowledge management editor that visualizes on-chain data**

Denoted a knowledge management editor that leverages current blockchain APIs to quickly visualize on-chain data - in one single place. The vision is to facilitate the creation and sharing of on-chain data for a broad audience.

- 🚀 Clean and easy WYSIWYG-editor
- ✨ Support for multiple API integrations including Covalent, Subgraph, and Lens, etc.
- 💾 Saved and retrieved on ComposeDB through your decentralized identity (DID)

## About

We built a WYSIWYG-editor with a clean and simple design to use immediately for any user. You start by connecting to the app through Web3Auth. When you’re connected, you’ll be able to start creating. Whenever you’re making that slash, you’re fetching from one of our many integrations. We have integrations built for Covalent, Subgraph, Tally, Dune, and Lens, etc. Lastly, the data is saved and retrieved in ComposeDB through your decentralized identifier.

**Live on [https://denoted.xyz/](https://denoted.xyz/)**

## Contribution

> ⚠️ This is very subject to change in order to improve developer exprience. It currently requires too many steps, so abstracting this configuration is needed.

If you want to contribute with your own `/command`, you can follow these steps:

1. Fork repository
2. Create new folder in `apps/web/components/commands` with the name of your command
3. Add the following files:
   - `command.ts` which adheres to the `CommandItemType`. Make sure the command is unique
   - `icon.png/svg/jpg` which will be used in the command list dropdown
   - The react component which will render the data. It should be named `Component.tsx` or the name of the integration. Check current components for examples
4. Update the `commands.ts` to include the command
5. Add a new folder in `apps/web/lib/tiptap/widgets` with your command. If it's a inline component you can see the `balance` components. If it's a full width block component you see the `iframe` components.
6. Verify your command works in the editor
7. Submit PR when you feel confident

## Architecture

<img width="1760" alt="denoted architecture" src="https://user-images.githubusercontent.com/25622412/222936136-07acfc97-d4ee-42a2-8677-22fe0ed90b38.png">

## Team

## Tech stack

- Package-Manager: `yarn`
- Monorepo Tooling: `turborepo`
- Frontend: `next`
  - Contract Interactions: `wagmi`, `rainbowkit`, `web3auth`
  - Styling: `tailwind`
- Miscellaneous:
  - Linting & Formatting: `eslint`, `prettier`

## Contributions

Denoted is open-source and meant to be used as community tooling. Feel free to open an issue or PR.

## Covalent

### Covalent API implementation

The reasoning behind implementing the Covalent API is that, for us, it is an easy way to fetch the wallet balances of an EOA requested by the user writing a community article.

The Covalent API implementation was straightforward. The API has good documentation overall.

Challenges faced:

- Implement chainID to match the standard and be able to switch networks instead of your naming (especially when working with WAGMI).

- Fetching can sometimes be slow.
