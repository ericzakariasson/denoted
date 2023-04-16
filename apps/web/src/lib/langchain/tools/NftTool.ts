import { Tool } from "langchain/tools";
import { nftFloorPriceCommand } from "../../../components/commands/nft/command";

const NFT_PORT_CHAINS: Record<number, string> = {
  1: "ethereum",
};

export class NftFloorPriceTool extends Tool {
  name = nftFloorPriceCommand.command;
  description = `
Use this tool to lookup the floor price for a NFT collection by contract address and chain.
Please provide the input to the tool as a JSON object containing address (string) & chainId (number).
    `;
  async _call(arg: string) {
    const { address, chainId } = JSON.parse(arg);

    const chain = chainId;
    const url = `https://api.nftport.xyz/v0/transactions/stats/${address}?chain=${NFT_PORT_CHAINS[chain]}`;
    const response = await fetch(url, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_NFT_PORT_API_KEY as string,
      },
    });

    if (response.status === 404) {
      return 'No results';
    }

    const json: any = await response.json();

    if (json.response === "NOK") {
      return json?.error?.message;
    }

    if (!response.ok) {
      return `NFT Port API error. Status: ${response.status} ${response.statusText}`;
    }

    return `${json.statistics.floor_price} ETH`;
  }
}