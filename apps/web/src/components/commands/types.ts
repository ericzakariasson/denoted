import { StaticImageData } from "next/image";
import { FunctionComponent, ReactNode } from "react";
import { CommandExtensionProps } from "../../lib/tiptap/types";

export type CommandConfiguration<
  Props extends Record<string, string | number | undefined>
> = {
  // visual
  command: string;
  title: string;
  description?: string;
  icon: StaticImageData | ReactNode | null;

  // editor
  blockType: "inline" | "block";
  defaultValues: Partial<Props>;

  // component
  ConfigComponent: FunctionComponent<CommandExtensionProps<Props>>;
};
