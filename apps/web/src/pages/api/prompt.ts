import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain/llms/openai";
import { CallbackManager } from "langchain/callbacks";
import { AgentExecutor, ZeroShotAgent } from "langchain/agents";
import { BalanceTool } from "../../lib/langchain/tools/BalanceTool";
import { NetWorthTool } from "../../lib/langchain/tools/NetWorthTool";
import { NftFloorPriceTool } from "../../lib/langchain/tools/NftTool";
import { CHAIN_CONTEXT } from "../../lib/langchain/utils";
import { NftCollectionSearchTool } from "../../lib/langchain/tools/NftCollectionSearchTool";

interface IntermediateStep {
  action: {
    tool: string;
    toolInput: string;
    log: string;
  };
  observation: string;
}

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
    new NftCollectionSearchTool(),
  ];

  const executor = AgentExecutor.fromAgentAndTools({
    agent: ZeroShotAgent.fromLLMAndTools(llm, tools, {
      prefix: [CHAIN_CONTEXT].join("\n\n"),
    }),
    tools,
    returnIntermediateSteps: true,
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
  const {
    output,
    intermediateSteps,
  } = await run(req.body.prompt);

  return res.json({
    query: req.body.prompt,
    output: output ?? null,
    intermediateSteps: intermediateSteps.map(
      (step: IntermediateStep) => ({
        action: {
          tool: step.action.tool,
          toolInput: JSON.parse(step.action.toolInput),
          log: step.action.log,
        },
        observation: step.observation,
      })
    ),
  });
}
