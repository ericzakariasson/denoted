import { Attributes, Node } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { CommandContext } from "../../components/CommandList";
import { COMMANDS } from "../../components/commands";
import { CommandConfiguration } from "../../components/commands/types";

export const insertComponent = (component: string) => (ctx: CommandContext) => {
  return ctx.editor
    .chain()
    .focus()
    .deleteRange(ctx.range)
    .insertContent(component)
    .run();
};

export function getCommandInsertAction<
  Props extends Record<string, string | number | undefined>
>(command: CommandConfiguration<Props>) {
  const attributes = Object.entries(command.defaultValues ?? {}).reduce<
    string[]
  >((attrs, [key, value]) => {
    if (value !== undefined) {
      attrs.push(`${key}=${value}`);
    }
    return attrs;
  }, []);

  const component = `<${command.command}${
    attributes.length > 0 ? " " + attributes.join(" ") : ""
  }></${command.command}>`;

  return insertComponent(component);
}

export function getCommandExtensions() {
  const commands = COMMANDS.flatMap((group) => group.items);
  const extensions = commands.map((command) => {
    const extension = Node.create({
      name: command.command,
      group: command.blockType === "inline" ? "inline" : "block",
      inline: command.blockType === "inline",
      selectable: command.blockType === "inline",
      atom: command.blockType === "block",
      draggable: command.blockType === "block",

      addAttributes() {
        const attributes = Object.entries(
          command.defaultValues ?? {}
        ).reduce<Attributes>((attributes, [key, value]) => {
          attributes[key] = {
            default: value,
            keepOnSplit: false,
          };

          return attributes;
        }, {});

        return attributes;
      },
      parseHTML() {
        return [
          {
            tag: command.command,
          },
        ];
      },
      renderHTML({ HTMLAttributes }) {
        return [command.command, mergeAttributes(HTMLAttributes)];
      },
      addNodeView() {
        return ReactNodeViewRenderer(command.ConfigComponent);
      },
    });

    return extension;
  });

  return extensions;
}
