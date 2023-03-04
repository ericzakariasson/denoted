import { Editor, Range } from "@tiptap/core";
import Image, { StaticImageData } from "next/image";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export type CommandContext = {
  editor: Editor;
  range: Range;
};

export type CommandItem = {
  title: string;
  description?: string;
  icon: StaticImageData;
  command: string;
  onCommand: (ctx: CommandContext) => void;
};

type CommandListProps = {
  items: CommandItem[];
};

export const CommandList = forwardRef<unknown, CommandListProps>(
  (props: any, ref) => {
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
      onKeyDown: ({ event }: any) => {
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

    return (
      <div className="w-64 overflow-hidden rounded-2xl bg-gray-100">
        {props.items.length ? (
          props.items.map((item: CommandItem, index: number) => (
            <button
              key={index}
              className={`flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-b-0 ${
                index === selectedIndex ? "bg-gray-200" : ""
              }`}
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
          ))
        ) : (
          <p className="w-full px-3 py-2 text-left">no result</p>
        )}
      </div>
    );
  }
);

CommandList.displayName = "CommandList";
