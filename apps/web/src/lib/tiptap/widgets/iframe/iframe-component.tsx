import { NodeViewWrapper } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import React, { useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { useEffect } from "react";
import Link from "next/link";
import { Label } from "../../../../components/Label";
import { CommandExtensionProps } from "../../types";

type IframeComponentProps = CommandExtensionProps<{
  src: string | null;
}>;

function formatHref(src: string) {
  if (src.startsWith("https://dune.com/embeds/")) {
    return src.replace("embeds", "queries");
  }

  return src;
}

export const IframeComponent = (props: IframeComponentProps) => {
  const [isOpen, setOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    props.updateAttributes({
      src: formData.get("src")?.toString() ?? "",
    });
    setOpen(false);
    props.editor.view.dom.focus();
  }

  const { src } = props.node.attrs;

  const isConfigured = src !== null;

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  return (
    <NodeViewWrapper>
      {isConfigured && (
        <div className="h-64 w-full">
          <iframe src={src} className="h-full w-full"></iframe>
        </div>
      )}
      <div className="flex items-start justify-start gap-2">
        {props.editor.isEditable && (
          <Popover.Root
            defaultOpen={!isConfigured}
            onOpenChange={setOpen}
            open={isOpen}
          >
            <Popover.Trigger className="rounded-full border border-gray-300 py-0 px-1 leading-normal text-gray-500">
              {isConfigured ? "update" : "setup"}
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
                  name="iframe-setup"
                >
                  <Label label="Source">
                    <input
                      name="src"
                      type="url"
                      defaultValue={src ?? ""}
                      required
                      placeholder="https://"
                      className="rounded-lg border-none bg-gray-200 px-3 py-2"
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
        {isConfigured && (
          <Link
            href={formatHref(src)}
            target="_blank"
            className="rounded-full border border-gray-300 py-0 px-1 font-normal leading-normal text-gray-500 no-underline"
          >
            open
          </Link>
        )}
      </div>
    </NodeViewWrapper>
  );
};
