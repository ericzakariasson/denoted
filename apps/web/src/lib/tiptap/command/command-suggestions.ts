import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { CommandItem, CommandList } from "../../../components/CommandList";

export const commandSuggestions = {
  items: ({ query, editor }: any) => {
    const COMMANDS: CommandItem[] = [
      {
        title: "balance",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent("<balance-component></balance-component>")
            .run();
        },
      },
      {
        title: "lens",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(`<lens-component></lens-component>`)
            .run();
        },
      },
      {
        title: "graph",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(`<graph-component></graph-component>`)
            .run();
        },
      },
      {
        title: "tally",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(`<tally-component></tally-component>`)
            .run();
        },
      },
      {
        title: "dune",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(`<iframe-component></iframe-component>`)
            .run();
        },
      },
    ];

    const { connectedAddress } = editor.storage;

    if (connectedAddress) {
      COMMANDS.unshift({
        title: "me",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(
              `<balance-component address="${connectedAddress}" symbol="ETH" chain="1"></balance-component>`
            )
            .run();
        },
      });
    }

    return COMMANDS.filter(
      (item) =>
        item !== null &&
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
