import { Editor, Range } from "@tiptap/core";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export type CommandItem = {
  title: string;
  command: (ctx: { editor: Editor; range: Range }) => void;
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
          props.items.map((item: any, index: number) => (
            <button
              className={`w-full border-b px-3 py-2 text-left last:border-b-0 ${
                index === selectedIndex ? "bg-gray-200" : ""
              }`}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item.title}
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
