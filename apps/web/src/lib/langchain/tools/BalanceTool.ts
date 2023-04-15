import { Tool } from "langchain/tools";
import { balanceCommand } from "../../../components/commands/balance/command";

export class BalanceTool extends Tool {
  name = "balance";
  description = `
Use the balance tool to lookup the balance of some cryptocurrency or token, i.e. ETH, OP, USDC etc., for a specific wallet address (can also be an ENS name ending with '.eth') and blockchain.
Please provide the input to the tool as JSON (with quotes around property names) containing address (string), chainId (number) & tokenSymbol (string).
    `;
  returnDirect = true;
  async _call(arg: string) {
    const { address, chainId, tokenSymbol } = JSON.parse(arg);
    return JSON.stringify({
      command: balanceCommand.command,
      args: {
        address,
        symbol: tokenSymbol,
        chain: chainId,
      },
    });
  }
}
