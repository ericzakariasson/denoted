# denoted

**A knowledge management editor that visualizes on-chain data**

Denoted a knowledge management editor that leverages current blockchain APIs to quickly visualize on-chain data - in one single place. The vision is to facilitate the creation and sharing of on-chain data for a broad audience.

- 🚀 Clean and easy WYSIWYG-editor 
- ✨ Support for multiple API integrations including Covalent, Subgraph, and Lens, etc.
- 💾 Saved and retrieved on ComposeDB through your decentralized identity (DID)
## About
We built a WYSIWYG-editor with a clean and simple design to use immediately for any user. You start by connecting to the app through Web3Auth. When you’re connected, you’ll be able to start creating. Whenever you’re making that slash, you’re fetching from one of our many integrations. We have integrations built for Covalent, Subgraph, Tally, Dune, and Lens, etc. Lastly, the data is saved and retrieved in ComposeDB through your decentralized identifier. 


**Live on [https://denoted.xyz/](https://denoted.xyz/)**

## Architecture
<img width="1760" alt="denoted architecture" src="https://user-images.githubusercontent.com/25622412/222936136-07acfc97-d4ee-42a2-8677-22fe0ed90b38.png">

## Team
## Get started
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

