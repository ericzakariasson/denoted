import { Tool } from "langchain/tools";
import { netWorthCommand } from "../../../components/commands/net-worth/command";

export class NetWorthTool extends Tool {
  name = netWorthCommand.command;
  description = `
Use the net worth tool to lookup the total amount worth in USD of cryptocurrencies and tokens for a specific wallet address or ENS name and blockchain.
Please provide the input to the tool formatted as JSON containing address (string) & chainId (number).
    `;
  async _call(arg: string) {
    const { address, chainId } = JSON.parse(arg);
    return JSON.stringify({
      command: netWorthCommand.command,
      args: {
        address,
        chain: chainId,
      },
    });
  }
}
