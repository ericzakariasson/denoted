import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import {
  CommandContext,
  CommandItem,
  CommandList,
} from "../../../components/CommandList";

const insertComponent = (component: string) => (ctx: CommandContext) => {
  return ctx.editor
    .chain()
    .focus()
    .deleteRange(ctx.range)
    .insertContent(component)
    .run();
};

const COMMANDS: CommandItem[] = [
  {
    command: "balance",
    title: "Balance",
    description: "Get wallet balance for account",
    icon: "",
    editorCommand: insertComponent("<balance-component></balance-component>"),
  },
  {
    command: "lens",
    title: "Lens",
    description: "Lens statistics",
    icon: "",
    editorCommand: insertComponent(`<lens-component></lens-component>`),
  },
  {
    command: "graph",
    title: "The Graph",
    description: "Query any graph endpoint",
    icon: "",
    editorCommand: insertComponent(`<graph-component></graph-component>`),
  },
  {
    command: "tally",
    title: "Tally",
    description: "Get DAO data with Tally",
    icon: "",
    editorCommand: insertComponent(`<tally-component></tally-component>`),
  },
  {
    command: "dune",
    title: "Dune",
    description: "Embed Dune Analytics queries",
    icon: "",
    editorCommand: insertComponent(`<iframe-component></tally-component>`),
  },
];

export const commandSuggestions = {
  items: ({ query, editor }: any) => {
    const { connectedAddress } = editor.storage;

    if (connectedAddress) {
      COMMANDS.unshift({
        command: "dune",
        title: "Dune",
        description: "Embed Dune Analytics queries",
        icon: "",
        editorCommand: insertComponent(
          `<balance-component address="${connectedAddress}" symbol="ETH" chain="1"></balance-component>`
        ),
      });
    }

    return COMMANDS.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    ).slice(0, 10);
  },

  render: () => {
    let component: any;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
