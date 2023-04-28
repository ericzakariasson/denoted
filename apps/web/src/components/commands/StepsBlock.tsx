import { useState } from "react";
import { useQueries } from "react-query";
import { COMMAND_ITEMS } from "./commands";
import {
  Node,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  mergeAttributes,
} from "@tiptap/react";
import { CommandExtensionProps } from "../../lib/tiptap/types";
import { TOOL_DATA_LOADER } from "../../lib/langchain/tools/tool-data-loader";
import { cn } from "../../utils/classnames";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CheckCircle2, CircleSlash, Loader2 } from "lucide-react";

type Step = {
  action: {
    log: string;
    tool: string;
    toolInput: Record<string, string>;
  };
  observation: string;
};

type StepsBlockProps = {
  steps: Step[];
};

export function StepsBlock(props: CommandExtensionProps<StepsBlockProps>) {
  const steps = props.node.attrs.steps;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<unknown[]>(
    new Array(steps.length).fill(null)
  );

  const fetchedStepIndex = stepResults.findLastIndex(
    (result) => result !== null
  );

  const stepsInput = steps.map((step, i) => {
    const inputTemplate = step.action.toolInput;
    const previousStepResult = stepResults[i - 1];
    const previousStepObservation = steps[i - 1]?.observation;

    const input =
      i === 0
        ? step.action.toolInput
        : Object.fromEntries(
            Object.entries(inputTemplate).map(([key, value]) => {
              if (value === previousStepObservation) {
                return [key, previousStepResult];
              }
              return [key, value];
            })
          );
    return input;
  });

  const queries = useQueries(
    steps.map((step, i) => {
      return {
        queryKey: ["step", step.action.tool, step.action.toolInput],
        queryFn: async () => {
          const input = stepsInput[i];
          const loader = TOOL_DATA_LOADER[step.action.tool];
          return await loader(input);
        },
        onSuccess: (data: unknown) => {
          setStepResults((results) => {
            results[i] = data;
            return results;
          });
        },
        enabled: i <= fetchedStepIndex + 1,
      };
    })
  );

  const lastResult = stepResults[stepResults.length - 1];

  return (
    <NodeViewWrapper as="div">
      <Popover>
        <PopoverTrigger>
          <Badge
            variant="outline"
            className={cn(
              "text-md relative h-6 border-slate-300 px-1 py-0 font-normal text-inherit"
            )}
          >
            {String(lastResult)}
          </Badge>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-6">
            {steps.map((step, i) => {
              const query = queries[i];
              const input = stepsInput[i];
              const result = stepResults[i];

              return (
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    {query.status === "loading" && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {query.status === "success" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {query.status === "error" && (
                      <CircleSlash className="h-4 w-4 text-red-500" />
                    )}
                    {step.action.tool}
                  </div>

                  <div className="prose">
                    Input
                    <pre className="whitespace-break-spaces break-all">
                      <code>{JSON.stringify(input)}</code>
                    </pre>
                  </div>
                  <div className="prose">
                    Output
                    <pre className="whitespace-break-spaces break-all">
                      <code>{JSON.stringify(result)}</code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}

export const extension = Node.create({
  name: "steps-block",
  group: "block",

  addAttributes() {
    return {
      steps: {
        default: [],
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "steps-block",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["steps-block", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(StepsBlock);
  },
});
