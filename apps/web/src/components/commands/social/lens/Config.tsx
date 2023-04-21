import { NodeViewWrapper } from "@tiptap/react";
import React, { useEffect, useMemo } from "react";

import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { LensWidget, LensWidgetProps } from "./Lens";
import { CommandExtensionProps } from "../../../../lib/tiptap/types";
import { Label } from "../../../Label";

export const LensConfig = (props: CommandExtensionProps<LensWidgetProps>) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    props.updateAttributes({
      publicationId: formData.get("publicationId")?.toString() ?? undefined,
      handle: formData.get("handle")?.toString() ?? undefined,
    });
    setOpen(false);
    props.editor.view.dom.focus();
  }

  const { property, publicationId, handle } = props.node.attrs;
  const isConfigured = publicationId !== undefined || handle !== undefined;

  const [isOpen, setOpen] = useState(false);

  const placeHolder = useMemo(() => {
    switch (property) {
      case "handle":
        return "E.g. ericz.lens";
      case "publicationId":
        return "E.g. 0x0f-0x01";
      default:
        return "";
    }
  }, [property]);

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <LensWidget
          property={property}
          publicationId={publicationId}
          handle={handle}
        />
      )}
      {props.editor.isEditable && (
        <Popover.Root
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <Popover.Trigger>
            {isConfigured ? (
              <LensWidget
                property={property}
                publicationId={publicationId}
                handle={handle}
              />
            ) : (
              <span className="rounded-full border border-slate-300 py-0 px-1 leading-normal text-slate-500">
                setup
              </span>
            )}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={5}
              align="start"
              className="s z-50 w-64 overflow-hidden rounded-2xl bg-slate-100 p-4 outline-none"
            >
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-start gap-4"
                name="lens-post-setup"
              >
                <Label label={property}>
                  <input
                    name={property}
                    placeholder={placeHolder}
                    className="rounded-lg bg-slate-200 px-3 py-2"
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
