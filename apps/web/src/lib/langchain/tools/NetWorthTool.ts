import { Tool } from "langchain/tools";
import { netWorthCommand } from "../../../components/commands/net-worth/command";
import { chainContext } from "../utils";

export class NetWorthTool extends Tool {
    name = "net-worth";
    description = `
Use the net worth tool to lookup the total amount of cryptocurrencies and tokens for a specific wallet address or ENS name and blockchain.
${chainContext}
Please provide the input to the tool as JSON containing address (string) & chainId (number).
    `;
    returnDirect = true;
    async _call(arg: string) {
      const { address, chainId } = JSON.parse(arg);
      return JSON.stringify({
        command: netWorthCommand.command,
        args: {
          address,
          chain: chainId,
        }
      });
    }
}