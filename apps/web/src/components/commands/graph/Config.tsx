import { NodeViewWrapper } from "@tiptap/react";
import React, { useEffect, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { GraphWidgetProps, GraphWidget } from "./Graph";
import { Label } from "../../Label";

type GraphComponentProps = CommandExtensionProps<GraphWidgetProps>;

export const GraphConfig = (props: GraphComponentProps) => {
  const [isOpen, setOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    props.updateAttributes({
      url: formData.get("url")?.toString() ?? undefined,
      query: formData.get("query")?.toString() ?? undefined,
      path: formData.get("path")?.toString() ?? undefined,
    });

    setOpen(false);

    props.editor.view.dom.focus();
  }

  const { url, query, path } = props.node.attrs;

  const isConfigured =
    url !== undefined && query !== undefined && path !== undefined;

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <GraphWidget url={url} query={query} path={path} />
      )}
      {props.editor.isEditable && (
        <Popover.Root
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <Popover.Trigger>
            {isConfigured ? (
              <GraphWidget url={url} query={query} path={path} />
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
                name="graph-setup"
              >
                <Label label="URL">
                  <input
                    name="url"
                    type="url"
                    defaultValue={url ?? ""}
                    required
                    className="rounded-lg border-none bg-gray-200 px-3 py-2"
                  />
                </Label>
                <Label label="Query">
                  <textarea
                    name="query"
                    defaultValue={query ?? ""}
                    placeholder={`query { 
  foo {
    bar
  }
}`}
                    className="rounded-lg border-none bg-gray-200 px-3 py-2 font-mono"
                    rows={5}
                    required
                  ></textarea>
                </Label>
                <Label label="Selector path">
                  <input
                    name="path"
                    defaultValue={path ?? ""}
                    placeholder="foo.bar"
                    required
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
    </NodeViewWrapper>
  );
};
