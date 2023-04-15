import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain/llms/openai";
import { CallbackManager } from "langchain/callbacks";
import { AgentExecutor, ZeroShotAgent } from "langchain/agents";
import { BalanceTool } from "../../lib/langchain/tools/BalanceTool";
import { NetWorthTool } from "../../lib/langchain/tools/NetWorthTool";
import { NftFloorPriceTool } from "../../lib/langchain/tools/NftTool";
import { CHAIN_CONTEXT } from "../../lib/langchain/utils";

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

export const run = async (input: string) => {
  const llm = new OpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
    callbackManager,
  });

  const tools = [
    new BalanceTool(),
    new NetWorthTool(),
    new NftFloorPriceTool(),
  ];

  const executor = AgentExecutor.fromAgentAndTools({
    agent: ZeroShotAgent.fromLLMAndTools(llm, tools, {
      prefix: [CHAIN_CONTEXT].join("\n\n"),
    }),
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
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { output } = await run(req.body.prompt);
  const results = { query: req.body.prompt, output: JSON.parse(output) };

  console.log(JSON.stringify(results, null, 4));

  return res.json(results);
}
