import { Tool } from "langchain/tools";
import { nftFloorPriceCommand } from "../../../components/commands/nft/command";
import { getNftFloorPrice } from "./tool-data-loader";

export class NftFloorPriceTool extends Tool {
  name = nftFloorPriceCommand.command;
  description = `
Use this tool to lookup the floor price for a NFT collection by contract address and chain.
Please provide the input to the tool as a JSON object containing address (string) & chainId (number).
    `;
  async _call(arg: string) {
    const { address, chainId } = JSON.parse(arg);
    return await getNftFloorPrice({ address, chainId });
  }
}
