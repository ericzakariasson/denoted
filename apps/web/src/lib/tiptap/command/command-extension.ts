import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { CommandContext } from "../../../components/CommandList";
import { CommandConfiguration } from "../../../components/commands/types";
import { getCommandInsertAction } from "../tiptap";
import * as analytics from "../../../lib/analytics";

export const Command = Extension.create({
  name: "commands",

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
          analytics.track("Command Handled", {
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
