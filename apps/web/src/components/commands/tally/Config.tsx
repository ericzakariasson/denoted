import { NodeViewWrapper } from "@tiptap/react";
import React, { useEffect, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { TallyWidget, TallyWidgetProps } from "./Tally";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Label } from "../../Label";

export const TallyConfig = (props: CommandExtensionProps<TallyWidgetProps>) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    props.updateAttributes({
      query: formData.get("query")?.toString() ?? "",
      path: formData.get("path")?.toString() ?? "",
    });
  }

  const { query, path } = props.node.attrs;

  const isConfigured = query !== undefined && path !== undefined;

  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <TallyWidget query={query} path={path} />
      )}
      {props.editor.isEditable && (
        <Popover.Root
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <Popover.Trigger>
            {isConfigured ? (
              <TallyWidget query={query} path={path} />
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
                name="tally-setup"
              >
                <Label label="Query">
                  <textarea
                    name="query"
                    defaultValue={query}
                    placeholder={`query { 
  foo {
    bar
  }
}`}
                    className="rounded-lg border-none bg-slate-200 px-3 py-2 font-mono"
                    rows={5}
                    required
                  ></textarea>
                </Label>
                <Label label="Selector path">
                  <input
                    name="path"
                    defaultValue={path}
                    placeholder="foo.bar"
                    required
                    className="rounded-lg border-none bg-slate-200 px-3 py-2"
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
