import { Editor } from "@tiptap/core";

export type CommandExtensionProps<
  Props extends Record<string, string | number | null | undefined>
> = {
  updateAttributes: (attributes: Props) => void;
  node: {
    attrs: Props;
  };
  editor: Editor;
};
