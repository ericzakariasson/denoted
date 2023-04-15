import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain/llms/openai";
import { CallbackManager } from "langchain/callbacks";
import { AgentExecutor, ZeroShotAgent } from "langchain/agents";
import { Tool } from "langchain/tools";
import * as chains from '@wagmi/chains';
import { balanceCommand } from "../../components/commands/balance/command";

const chainContext = [chains.arbitrum, chains.mainnet, chains.polygon, chains.optimism]
  .map(({
    id,
    name,
    network,
    nativeCurrency,
  }) => [
    id,
    name,
    network,
    nativeCurrency.symbol,
  ].join(',')
).join("\n");

const callbackManager = CallbackManager.fromHandlers({
  async handleLLMNewToken(token: string) {
    console.log("token", { token });
  },
  async handleLLMStart(llm, _prompts: string[]) {
    console.log("handleLLMStart", { llm, prompts: _prompts });
  },
  async handleChainStart(chain) {
    console.log("handleChainStart", { chain });
  },
  async handleAgentAction(action) {
    console.log("handleAgentAction", action);
  },
  async handleToolStart(tool) {
    console.log("handleToolStart", { tool });
  },
});

class BalanceTool extends Tool {
    name = "balance";
    description = `
Use the balance tool to lookup the balance of some cryptocurrency or token, i.e. ETH, OP, USDC etc., for a specific wallet address or ENS name and blockchain.
${chainContext}
Please provide the input to the tool as a JSON object containing address (string), chainId (number) & tokenSymbol (string).
    `;
    async _call(arg: string) {
      const { address, chainId, tokenSymbol } = JSON.parse(arg);
      return JSON.stringify({
        command: balanceCommand.command,
        args: {
          address,
          symbol: tokenSymbol,
          chain: chainId,
        }
      });
    }
    returnDirect = true;
}

export const run = async (input: string) => {
  const llm = new OpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
    callbackManager,
  });

  const tools = [
    new BalanceTool(true),
  ];

  const executor = AgentExecutor.fromAgentAndTools({
    agent: ZeroShotAgent.fromLLMAndTools(llm, tools),
    tools,
    returnIntermediateSteps: false,
    verbose: true,
    callbackManager,
  });

  console.log("Loaded agent.");

  console.log(`Executing with input "${input}"`);

  const result = await executor.call({ input });

  console.log(`Got output ${result.output}`);

  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = { query: req.body.prompt, ...await run(req.body.prompt) };
  
  console.log(JSON.stringify(results, null, 4));

  return res.json(results);
}