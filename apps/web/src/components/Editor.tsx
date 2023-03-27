import { Content, JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PropsWithChildren } from "react";

import { useAccount } from "wagmi";
import { Command } from "../lib/tiptap/command/command-extension";
import { commandSuggestions } from "../lib/tiptap/command/command-suggestions";
import { getCommandExtensions } from "../lib/tiptap/tiptap";

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
        "border border-r-0 border-black px-2 first:rounded-tl-full first:rounded-bl-full last:rounded-tr-full last:rounded-br-full last:border-r " +
        (isActive ? "bg-black text-white" : "bg-white")
      }
    >
      {children}
    </button>
  );
};

type EditorProps = {
  initialContent?: Content;
  onUpdate?: (json: JSONContent) => void;
};

const commandExtensions = getCommandExtensions();

export const extensions = [
  StarterKit,
  Highlight,
  Typography,
  ...commandExtensions,
];

export const Editor = ({ initialContent, onUpdate }: EditorProps) => {
  const { address } = useAccount();
  const editor = useEditor({
    extensions: [
      ...extensions,
      Placeholder.configure({
        placeholder: () => "Use '/' for commands",
      }),
      Command.configure({
        HTMLAttributes: {
          class: "command",
        },
        suggestion: commandSuggestions,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert focus:outline-none max-w-none",
      },
    },
    onUpdate: (data) => onUpdate?.(data.editor.getJSON()),
  });

  if (editor) {
    editor.storage.connectedAddress = address;
  }

  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex"
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
