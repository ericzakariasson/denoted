import { Content, JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import LinkExtension from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import { EditorView } from "@tiptap/pm/view";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PropsWithChildren, useEffect } from "react";
import { useAccount } from "wagmi";
import { Command } from "../lib/tiptap/command/command-extension";
import { commandSuggestions } from "../lib/tiptap/command/command-suggestions";
import { getCommandExtensions } from "../lib/tiptap/tiptap";
import { Toggle } from "./ui/toggle";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link2,
  Link2Off,
  Strikethrough,
} from "lucide-react";
import { TrailingNode } from "../lib/tiptap/extensions/trailing-node";
import * as IpfsImage from "../components/commands/ipfs-image";

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
  initialContent?: Content;
  onUpdate?: (json: JSONContent) => void;
  focusedEditorState: [boolean, (state: boolean) => void];
  className?: string;
  encryptionKey?: CryptoKey;
};

const commandExtensions = getCommandExtensions();
export const extensions = [
  StarterKit.configure({
    dropcursor: {
      width: 4,
      class: "text-slate-400",
    },
  }),
  Highlight,
  Typography,
  IpfsImage.extension,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  LinkExtension.configure({
    HTMLAttributes: {
      class: "cursor-pointer",
    },
  }),
  ...commandExtensions,
  TrailingNode,
];

export const Editor = ({
  initialContent,
  onUpdate,
  focusedEditorState,
  className,
  encryptionKey,
}: EditorProps) => {
  const { address } = useAccount();
  const [focusEditor, setFocusEditor] = focusedEditorState;

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
        class: "h-full prose dark:prose-invert focus:outline-none max-w-none",
      },
      handleDrop(view, event, slice, moved) {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          event.preventDefault();

          const isValidImageType = (file: File) =>
            file.type === "image/jpeg" || file.type === "image/png";

          const getImageSizeInMB = (file: File) =>
            parseFloat((file.size / 1024 / 1024).toFixed(4));

          const insertImageToEditor = (
            view: EditorView,
            event: DragEvent,
            file: File
          ) => {
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            const node = view.state.schema.nodes["ipfs-image"].create({
              file,
              title: file.name,
              alt: file.name,
            });
            const transaction = view.state.tr.insert(coordinates!.pos, node);
            view.dispatch(transaction);
          };

          try {
            const file = event.dataTransfer.files[0];
            const fileSize = getImageSizeInMB(file);

            if (!isValidImageType(file) || fileSize >= 10) {
              throw new Error(
                "Images need to be in jpg or png format and less than 10mb in size."
              );
            }

            insertImageToEditor(view, event, file);
          } catch (error) {
            return false;
          }
        }
        return false;
      },
    },
    onUpdate: (data) => onUpdate?.(data.editor.getJSON()),
  });

  useEffect(() => {
    if (focusEditor) {
      editor?.chain().focus();
      setFocusEditor(false);
    }
  }, [focusEditor, editor, setFocusEditor]);

  if (editor) {
    editor.storage.encryptionKey = encryptionKey; 
    editor.storage.connectedAddress = address;
  }

  return (
    <>
      {editor && (
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
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
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
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
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
      )}
      <EditorContent className={className} editor={editor} />
    </>
  );
};
