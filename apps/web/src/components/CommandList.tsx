import { Editor, Range } from "@tiptap/core";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import Image from "next/image";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useMutation } from "react-query";
import { getCommandInsertAction } from "../lib/tiptap/tiptap";
import { cn } from "../utils/classnames";
import { COMMAND_ITEMS } from "./commands/commands";
import { CommandConfiguration } from "./commands/types";
import { Card, CardContent } from "./ui/card";

export type CommandContext = {
  editor: Editor;
  range: Range;
};

export type CommandGroup = {
  name: string;
  items: CommandConfiguration<any>[];
};

export type CommandListItem = CommandGroup;

export type CommandListHandle = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export type CommandListProps = SuggestionProps<CommandListItem>;

export const CommandList = forwardRef<CommandListHandle, CommandListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(1);

    const allCommands = useMemo(
      () => props.items.flatMap((item) => item.items),
      [props.items]
    );

    const totalItems = allCommands.length;

    const selectItem = (index: number) => {
      const item = allCommands[index];

      if (item) {
        props.command(item as any);
      }
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + totalItems - 1) % totalItems);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % totalItems);
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

    const promptMutation = useMutation(
      async (prompt: string) => {
        const response = await fetch("/api/prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
          }),
        });

        const data = await response.json();

        return data;
      },
      {
        onSuccess: (data) => {
          const cmd = COMMAND_ITEMS.find(
            (c) => c.command === data.output.command
          );

          if (cmd) {
            const insert = getCommandInsertAction(cmd, data.output.args);
            insert({ editor: props.editor, range: props.range });
          }
        },
      }
    );

    if (props.items.length === 0) {
      return (
        <div className="w-64 overflow-hidden rounded-2xl bg-gray-100 p-4">
          <button onClick={() => promptMutation.mutate(props.query)}>
            proompt
          </button>
        </div>
      );
    }

    return (
      <Card className="w-64">
        <CardContent className="p-0">
          {props.items.map((item) => {
            return (
              <div key={item.name} className="border-t first:border-none">
                <p className="px-3 py-2 text-xs text-slate-500">{item.name}</p>
                <div>
                  {item.items.map((item) => {
                    const index = allCommands
                      .map((c) => c.command)
                      .indexOf(item.command);
                    return (
                      <CommandItemButton
                        key={item.command}
                        item={item}
                        index={index}
                        selectedIndex={selectedIndex}
                        onSelect={selectItem}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }
);

const CommandItemButton = <T extends Record<string, string>>({
  item,
  index,
  selectedIndex,
  onSelect,
}: {
  item: CommandConfiguration<T>;
  index: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
}) => {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 border-t border-slate-50 px-3 py-2 text-left hover:bg-slate-100",
        index === selectedIndex && "bg-slate-100"
      )}
      onClick={() => onSelect(index)}
    >
      {item.icon ? (
        <Image {...item.icon} width={24} height={24} alt={item.title} />
      ) : (
        <div className="h-[24px] w-[24px] rounded-sm bg-slate-100" />
      )}
      <div className="flex flex-col">
        <p>{item.title}</p>
        {item.description && (
          <p className="text-xs text-slate-500">{item.description}</p>
        )}
      </div>
    </button>
  );
};

CommandList.displayName = "CommandList";
