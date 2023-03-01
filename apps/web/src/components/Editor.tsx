import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { PropsWithChildren } from "react";
import { JSONContent } from "@tiptap/core";

type BubbleMenuButtonProps = {
  onClick: () => void;
  isActive: boolean;
};

const BubbleMenuButton = ({
  onClick,
  isActive,
  children,
}: PropsWithChildren<BubbleMenuButtonProps>) => {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-2 " +
        (isActive ? "bg-black text-white" : "border-black bg-white")
      }
    >
      {children}
    </button>
  );
};

type EditorProps = {
  initialContent: JSONContent;
};

export const Editor = ({ initialContent }: EditorProps) => {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Highlight, Typography],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex gap-2"
        >
          <BubbleMenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            bold
          </BubbleMenuButton>
          <BubbleMenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            italic
          </BubbleMenuButton>
          <BubbleMenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
          >
            strike
          </BubbleMenuButton>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </>
  );
};
