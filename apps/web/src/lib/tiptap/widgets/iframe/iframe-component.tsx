import { NodeViewWrapper } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import React, { useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { useEffect } from "react";
import Link from "next/link";

type IframeComponentProps = {
  updateAttributes: (attributes: Record<string, string>) => void;
  node: {
    attrs: {
      src: string | null;
    };
  };
  editor: Editor;
};

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
                className="data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2 s z-50 w-72 rounded-md border border-black bg-white p-4 outline-none dark:border-slate-800 dark:bg-slate-800"
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-2"
                  name="iframe-setup"
                >
                  <input name="src" type="url" defaultValue={src ?? ""} />
                  <button type="submit">save</button>
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
