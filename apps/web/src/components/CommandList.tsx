import { Editor, Range } from "@tiptap/core";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import Image, { StaticImageData } from "next/image";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { cn } from "../utils/classnames";

export type CommandContext = {
  editor: Editor;
  range: Range;
};

export type BaseCommandItem<Command extends string> = {
  title: string;
  description?: string;
  icon: StaticImageData;
  command: Command;
  onCommand: (ctx: CommandContext) => void;
};

export type CommandGroup = BaseCommandItem<string> & {
  type: "group";
  items: CommandItem<string>[];
};

export type CommandItem<Command extends string = string> =
  BaseCommandItem<Command> & {
    type?: "item";
  };

export type CommandListItem<Command extends string> =
  | CommandGroup
  | CommandItem<Command>;

export type CommandListHandle = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export type CommandListProps = SuggestionProps<CommandListItem<string>>;

export const CommandList = forwardRef<CommandListHandle, CommandListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command(item);
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    if (props.items.length === 0) {
      return (
        <div className="w-64 overflow-hidden rounded-2xl bg-gray-100">
          <p className="w-full px-3 py-2 text-left">no result</p>
        </div>
      );
    }

    return (
      <div className="w-64 overflow-hidden rounded-2xl bg-gray-100">
        {props.items.map((item, index) => {
          if (item.type === "group") {
            return (
              <button
                key={item.command}
                disabled
                className={cn(
                  "flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-b-0 disabled:opacity-50",
                  index === selectedIndex && "bg-gray-200"
                )}
              >
                <Image {...item.icon} width={24} height={24} alt={item.title} />
                <div className="flex flex-col">
                  <p>{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-gray-500">{item.description}</p>
                  )}
                </div>
                <div className="ml-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>
            );
          }
          return (
            <button
              key={item.command}
              className={cn(
                "flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-b-0",
                index === selectedIndex && "bg-gray-200"
              )}
              onClick={() => selectItem(index)}
            >
              <Image {...item.icon} width={24} height={24} alt={item.title} />
              <div className="flex flex-col">
                <p>{item.title}</p>
                {item.description && (
                  <p className="text-xs text-gray-500">{item.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  }
);

CommandList.displayName = "CommandList";
