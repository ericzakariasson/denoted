import { Tool } from "langchain/tools";
import { searchNftCollection } from "./tool-data-loader";

export class NftCollectionSearchTool extends Tool {
  name = "nft-collection-search";
  description = `
Use this tool to search for NFT collections using a search term. It will return the contract address of the collection, no other information.
This tool should preferably be used in combination with other tools that require a NFT collection contract address as input
Please provide the input to the tool as a JSON object (with quotes around property names) containing query (string) & chainId (number).
    `;
  async _call(arg: string) {
    const { query, chainId } = JSON.parse(arg);
    return await searchNftCollection({ query, chainId });
  }
}
