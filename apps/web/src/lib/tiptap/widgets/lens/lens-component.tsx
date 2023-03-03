import { NodeViewWrapper } from "@tiptap/react";
import React from "react";
import { LensWidget } from "../../../../components/widgets/Lens";

import * as Popover from "@radix-ui/react-popover";

type LensComponentProps = {
  updateAttributes: (attributes: Record<string, string>) => void;
  node: {
    attrs: {
      handle: string | undefined;
    };
  };
};

export const LensComponent = (props: LensComponentProps) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    props.updateAttributes({
      handle: formData.get("handle")?.toString() ?? "",
    });
  }

  const handle = props.node.attrs.handle;

  const isConfigured = handle !== undefined;

  return (
    <NodeViewWrapper as="span">
      <Popover.Root defaultOpen={!isConfigured}>
        <Popover.Trigger>
          {isConfigured ? (
            <LensWidget handle={handle} />
          ) : (
            <span className="rounded-full border border-gray-300 py-0 px-1 leading-normal text-gray-500">
              setup
            </span>
          )}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={5}
            align="start"
            className="data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2 s z-50 w-72 rounded-md border border-black bg-white p-4 outline-none dark:border-slate-800 dark:bg-slate-800"
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2"
              name="lens-setup"
            >
              <input
                name="handle"
                placeholder={"ericz.lens"}
                defaultValue={handle}
              />
              <button type="submit">save</button>
            </form>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </NodeViewWrapper>
  );
};
