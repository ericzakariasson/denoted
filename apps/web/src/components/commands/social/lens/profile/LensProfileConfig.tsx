import { NodeViewWrapper } from "@tiptap/react";
import React, { useEffect } from "react";

import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { LensWidget, LensWidgetProps } from "./LensProfile";
import { CommandExtensionProps } from "../../../../../lib/tiptap/types";
import { Label } from "../../../../Label";

export const LensConfig = (props: CommandExtensionProps<LensWidgetProps>) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    props.updateAttributes({
      handle: formData.get("handle")?.toString() ?? "",
    });
    setOpen(false);
    props.editor.view.dom.focus();
  }

  const handle = props.node.attrs.handle;

  const isConfigured = handle !== undefined;
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <LensWidget handle={handle} />
      )}
      {props.editor.isEditable && (
        <Popover.Root
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
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
              className="s z-50 w-64 overflow-hidden rounded-2xl bg-gray-100 p-4 outline-none"
            >
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-start gap-4"
                name="lens-profile-setup"
              >
                <Label label="Handle">
                  <input
                    name="handle"
                    placeholder="ericz.lens"
                    className="rounded-lg bg-gray-200 px-3 py-2"
                    defaultValue={handle}
                    required
                  />
                </Label>
                <button
                  type="submit"
                  className="rounded-full border border-black px-2 py-0 text-black"
                >
                  save
                </button>
              </form>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </NodeViewWrapper>
  );
};
