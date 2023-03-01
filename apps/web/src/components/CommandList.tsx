import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

type Item = {
  title: string;
  command: () => void;
};

export const CommandList = forwardRef((props: any, ref) => {
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
    <div className="rounded-xl border bg-white">
      {props.items.length ? (
        props.items.map((item: any, index: number) => (
          <button
            className={`w-full px-2 py-1 text-left ${
              index === selectedIndex ? "bg-slate-200" : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item.title}
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
});

CommandList.displayName = "CommandList";
