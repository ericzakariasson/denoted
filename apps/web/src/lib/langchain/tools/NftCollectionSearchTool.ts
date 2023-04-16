import { Tool } from "langchain/tools";

export class NftCollectionSearchTool extends Tool {
  name = "nft-collection-search";
  description = `
Use this tool to search for NFT collections using a search term. It will return the contract address of the collection, no other information.
This tool should preferably be used in combination with other tools that require a NFT collection contract address as input
Please provide the input to the tool as a JSON object (with quotes around property names) containing query (string) & chainName (string).
    `;
  async _call(arg: string) {
    const { query, chainName } = JSON.parse(arg);
    const result = await fetch(
      `https://api.nftport.xyz/v0/search/contracts?text=${encodeURIComponent(
        query
      )}&chain=${chainName.toLowerCase()}&page_size=1`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: process.env.NEXT_PUBLIC_NFT_PORT_API_KEY as string,
        },
      }
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));

    return `"${result.search_results.at(0).contract_address}"`;
  }
}
