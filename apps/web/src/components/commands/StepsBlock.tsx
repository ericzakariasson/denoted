import { useState } from "react";
import { useQueries } from "react-query";
import { COMMAND_ITEMS } from "./commands";
import { Node } from "@tiptap/react";

type Step = {
  tool: string;
  input: string;
  output: string;
};

type StepsBlockProps = {
  steps: Step[];
};

export function StepsBlock(props: StepsBlockProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const queries = useQueries(
    props.steps.map((step, i) => {
      return {
        queryKey: ["step", step.tool, step.input],
        queryFn: () => Promise.resolve(i),
        enabled: i <= currentStepIndex,
      };
    })
  );

  const isAllSuccess = queries.every((query) => query.isSuccess);

  const lastStep = props.steps[props.steps.length - 1];
  const command = COMMAND_ITEMS.find((item) => item.command === lastStep.tool);

  return <div></div>;
}

const extension = Node.create({
  addAttributes() {
    return {
      steps: {
        default: null,
      },
    };
  },
});
