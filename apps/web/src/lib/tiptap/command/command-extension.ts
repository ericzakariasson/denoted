import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { CommandContext } from "../../../components/CommandList";
import { CommandConfiguration } from "../../../components/commands/types";
import { trackEvent } from "../../analytics";
import { getCommandInsertAction } from "../tiptap";

export const Command = Extension.create({
  name: "slash-commands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: <T extends Record<string, string | number | undefined>>({
          editor,
          range,
          props,
        }: CommandContext & { props: CommandConfiguration<T> }) => {
          const insert = getCommandInsertAction(props);
          insert({ editor, range });
          trackEvent("Command Handled", {
            command: props.command,
          });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
