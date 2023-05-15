import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./Editor";

type ViewerProps = {
  json: JSONContent;
  encryptionKey?: CryptoKey;
};

export const Viewer = ({ json, encryptionKey }: ViewerProps) => {
  const editor = useEditor({
    editable: false,
    extensions: [...extensions],
    content: json,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert focus:outline-nonem max-w-none",
      },
    },
  });

  if (editor) {
    editor.storage.encryptionKey = encryptionKey; 
  }

  return <EditorContent editor={editor} />;
};
