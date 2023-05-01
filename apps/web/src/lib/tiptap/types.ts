import { Editor } from "@tiptap/core";

export type CommandExtensionProps<
  Props extends Record<string, string | number | null | undefined | File>
> = {
  updateAttributes: (attributes: Partial<Props>) => void;
  node: {
    attrs: Props;
  };
  editor: Editor;
};
