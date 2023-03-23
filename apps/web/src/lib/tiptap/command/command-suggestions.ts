import { ReactRenderer } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import { RefAttributes } from "react";
import tippy from "tippy.js";
import {
  CommandList,
  CommandListHandle,
  CommandListItem,
  CommandListProps,
} from "../../../components/CommandList";
import { COMMANDS } from "../../../components/commands";

export const commandSuggestions: Omit<
  SuggestionOptions<CommandListItem>,
  "editor"
> = {
  items: ({ query }) => {
    return COMMANDS.filter((item) => {
      if (item.type === "group") {
        return item.items.filter((item) =>
          item.title.toLowerCase().startsWith(query.toLowerCase())
        );
      }

      return item.title.toLowerCase().startsWith(query.toLowerCase());
    }).slice(0, 10);
  },
  render: () => {
    let component: ReactRenderer<
      CommandListHandle,
      CommandListProps & RefAttributes<CommandListHandle>
    >;
    let popup: ReturnType<typeof tippy>;

    return {
      onStart: (props) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect as () => DOMRect,
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

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }

        return component.ref?.onKeyDown(props) ?? false;
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
