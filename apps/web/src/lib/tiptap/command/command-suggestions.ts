import { ReactRenderer } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import tippy from "tippy.js";
import { CommandList } from "../../../components/CommandList";

export const commandSuggestions = {
  items: ({ query, editor }: any) => {
    const COMMANDS = [
      {
        title: "wallet",
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent("<wallet-component></wallet-component>")
            .run();
        },
      },

      {
        title: "lens",
        command: ({ editor, range }: { editor: Editor; range: any }) => {
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
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(`<graph-component></graph-component>`)
            .run();
        },
      },
    ];

    const { connectedAddress } = editor.storage;

    if (connectedAddress) {
      COMMANDS.unshift({
        title: "me",
        command: ({ editor, range }: { editor: Editor; range: any }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(
              `<wallet-component address="${connectedAddress}" symbol="ETH" chain="1"></wallet-component>`
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
