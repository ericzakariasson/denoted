import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { EditorView } from "@tiptap/pm/view";
import { EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { lowlight } from "lowlight";
import { useAccount } from "wagmi";
import * as IpfsImage from "../components/commands/ipfs-image";
import { Command } from "../lib/tiptap/command/command-extension";
import { commandSuggestions } from "../lib/tiptap/command/command-suggestions";
import { TrailingNode } from "../lib/tiptap/extensions/trailing-node";
import { getCommandExtensions } from "../lib/tiptap/tiptap";

const commandExtensions = getCommandExtensions();

export const defaultExtensions = [
  StarterKit.configure({
    dropcursor: {
      width: 4,
      class: "text-slate-400",
    },
    codeBlock: false,
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
  CodeBlockLowlight.configure({
    lowlight,
  }),
];

function useTiptapEditor({
  content,
  encryptionKey,
  extensions,
  ...props
}: UsePageEditorProps) {
  const { address } = useAccount();

  const editor = useEditor({
    ...props,
    extensions,
    content,
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
  });

  if (editor) {
    editor.storage.encryptionKey = encryptionKey;
    editor.storage.connectedAddress = address;
  }

  return { editor };
}

type UsePageEditorProps = Partial<EditorOptions> & {
  encryptionKey?: CryptoKey;
};

export function usePageEditorViewer(
  props: Omit<UsePageEditorProps, "extensions">
) {
  return useTiptapEditor({
    ...props,
    extensions: defaultExtensions,
  });
}

export function usePageEditor(props: Omit<UsePageEditorProps, "extensions">) {
  return useTiptapEditor({
    ...props,
    extensions: [
      ...defaultExtensions,
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
  });
}
