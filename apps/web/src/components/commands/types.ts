import { StaticImageData } from "next/image";
import { FunctionComponent } from "react";
import { CommandExtensionProps } from "../../lib/tiptap/types";

export type BaseProps = Record<string, string | number | undefined | File>;

export type CommandConfiguration<Props extends BaseProps> = {
  // visual
  command: string;
  title: string;
  description?: string;
  icon: StaticImageData | null;

  // editor
  blockType: "inline" | "block";
  defaultValues: Partial<Props>;

  // component
  ConfigComponent: FunctionComponent<CommandExtensionProps<Props>>;
};
