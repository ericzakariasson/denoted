import { Content, JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PropsWithChildren } from "react";
import Image from "@tiptap/extension-image";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { Command } from "../lib/tiptap/command/command-extension";
import { commandSuggestions } from "../lib/tiptap/command/command-suggestions";
import { getCommandExtensions } from "../lib/tiptap/tiptap";
import { EditorView } from "@tiptap/pm/view";
import { Toggle } from "./ui/toggle";

import { Bold, Italic, Strikethrough } from "lucide-react";

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
      variant={"outline"}
      onPressedChange={onClick}
      className="h-8 p-2"
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
};

const commandExtensions = getCommandExtensions();
export const extensions = [
  StarterKit,
  Highlight,
  Typography,
  Image,
  ...commandExtensions,
];

export const Editor = ({
  initialContent,
  onUpdate,
  focusedEditorState,
  className,
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
            src: string
          ) => {
            const { schema } = view.state;
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            const node = schema.nodes.image.create({ src });
            const transaction = view.state.tr.insert(coordinates!.pos, node);
            return view.dispatch(transaction);
          };

          try {
            const file = event.dataTransfer.files[0];
            const fileSize = getImageSizeInMB(file);

            if (!isValidImageType(file) || fileSize >= 10) {
              throw new Error(
                "Images need to be in jpg or png format and less than 10mb in size."
              );
            }

            const img = new global.Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
              if (img.width > 2000 || img.height > 2000) {
                throw new Error(
                  "Images need to be less than 2000px in width or height."
                );
              }

              uploadImage(file).then((response) => {
                const img = new global.Image();
                img.src = response;
                img.onload = () => {
                  return insertImageToEditor(view, event, response);
                };
              });
            };
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
    editor.storage.connectedAddress = address;
  }

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
        </BubbleMenu>
      )}
      <EditorContent className={className} editor={editor} />
    </>
  );
};

async function uploadImage(file: File): Promise<string> {
  return URL.createObjectURL(file);
}
