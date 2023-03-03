import { title } from "process";
import { FunctionComponent, ReactNode } from "react";

export type CommandConfiguration<Props> = {
  // visual
  command: string;
  title: string;
  description?: string;
  icon: ReactNode;

  // editor
  blockType: "inline" | "block";
  defaultValues: Partial<Props>;

  // component
  component: FunctionComponent<Props>;
};
