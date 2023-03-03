import type { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./Editor";

type ViewerProps = {
  json: JSONContent;
};

export const Viewer = ({ json }: ViewerProps) => {
  const editor = useEditor({
    editable: false,
    extensions: [...extensions],
    content: json,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert focus:outline-none",
      },
    },
  });

  return <EditorContent editor={editor} />;
};
