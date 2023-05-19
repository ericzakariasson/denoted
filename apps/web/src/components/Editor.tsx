import {
  BubbleMenu,
  Editor as TiptapEditor,
  EditorContent,
} from "@tiptap/react";
import "highlight.js/lib/languages/css";
import "highlight.js/lib/languages/javascript";
import "highlight.js/lib/languages/typescript";
import "highlight.js/lib/languages/xml";
import { PropsWithChildren } from "react";
import { Toggle } from "./ui/toggle";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  Link2Off,
  Strikethrough,
} from "lucide-react";

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
    <Toggle
      pressed={isActive}
      onPressedChange={onClick}
      className="h-8 rounded-none bg-white p-2"
    >
      {children}
    </Toggle>
  );
};

type EditorProps = {
  className?: string;
  editor: TiptapEditor;
};

export const Editor = ({ className, editor }: EditorProps) => {
  return (
    <>
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="flex overflow-hidden rounded-md border"
      >
        <div className="flex">
          <BubbleMenuButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
          >
            <AlignLeft className="h-4 w-4" />
          </BubbleMenuButton>
          <BubbleMenuButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
          >
            <AlignCenter className="h-4 w-4" />
          </BubbleMenuButton>
          <BubbleMenuButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
          >
            <AlignRight className="h-4 w-4" />
          </BubbleMenuButton>
          <BubbleMenuButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
          >
            <AlignJustify className="h-4 w-4" />
          </BubbleMenuButton>
        </div>
        <div className="w-[1px h-[32px] bg-slate-200" />
        <div className="flex">
          <BubbleMenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            <Bold className="h-4 w-4" />
          </BubbleMenuButton>
          <BubbleMenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            <Italic className="h-4 w-4" />
          </BubbleMenuButton>
          <BubbleMenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
          >
            <Strikethrough className="h-4 w-4" />
          </BubbleMenuButton>
          <BubbleMenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
          >
            <Code className="h-4 w-4" />
          </BubbleMenuButton>
        </div>
        {editor.isActive("link") && (
          <>
            <div className="h-[32px] w-[1px] bg-slate-200" />
            <div className="flex">
              <BubbleMenuButton
                onClick={() => editor.chain().focus().unsetLink().run()}
                isActive={editor.isActive("link")}
              >
                <Link2Off className="h-4 w-4" />
              </BubbleMenuButton>
            </div>
          </>
        )}
      </BubbleMenu>
      <EditorContent className={className} editor={editor} />
    </>
  );
};
