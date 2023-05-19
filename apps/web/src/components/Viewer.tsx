import type { JSONContent } from "@tiptap/core";
import { EditorContent } from "@tiptap/react";
import { usePageEditorViewer } from "../hooks/usePageEditor";

type ViewerProps = {
  json: JSONContent;
  encryptionKey?: CryptoKey;
};

export const Viewer = ({ json, encryptionKey }: ViewerProps) => {
  const { editor } = usePageEditorViewer({
    editable: false,
    content: json,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert focus:outline-nonem max-w-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  if (editor) {
    editor.storage.encryptionKey = encryptionKey;
  }

  return <EditorContent editor={editor} />;
};
