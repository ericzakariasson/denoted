import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import { PropsWithChildren } from "react";
import { Content, JSONContent } from "@tiptap/core";

import { Command } from "../lib/tiptap/command/command-extension";
import { commandSuggestions } from "../lib/tiptap/command/command-suggestions";
import { Wallet } from "../lib/tiptap/widgets/wallet/wallet-extension";
import { useAccount } from "wagmi";
import { Lens } from "../lib/tiptap/widgets/lens/lens-extension";
import { Graph } from "../lib/tiptap/widgets/graph/graph-extension";

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
  initialContent?: Content;
  onUpdate?: (json: JSONContent) => void;
};

export const extensions = [
  StarterKit,
  Highlight,
  Typography,
  Wallet,
  Lens,
  Graph,
];

export const Editor = ({ initialContent, onUpdate }: EditorProps) => {
  const { address } = useAccount();
  const editor = useEditor({
    extensions: [
      ...extensions,
      Placeholder,
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
        class: "prose dark:prose-invert focus:outline-none",
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
          className="flex gap-1"
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
