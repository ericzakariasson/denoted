import { NodeViewWrapper } from "@tiptap/react";
import React from "react";
import { GraphWidget } from "../../../../components/widgets/Graph";

import * as Popover from "@radix-ui/react-popover";
import { Label } from "../../../../components/Label";

type GraphComponentProps = {
  updateAttributes: (attributes: Record<string, string>) => void;
  node: {
    attrs: {
      url: string | undefined;
      query: string | undefined;
      path: string | undefined;
    };
  };
};

export const GraphComponent = (props: GraphComponentProps) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    props.updateAttributes({
      url: formData.get("url")?.toString() ?? "",
      query: formData.get("query")?.toString() ?? "",
      path: formData.get("path")?.toString() ?? "",
    });
  }

  const { url, query, path } = props.node.attrs;

  const isConfigured =
    url !== undefined && query !== undefined && path !== undefined;

  return (
    <NodeViewWrapper as="span">
      <Popover.Root defaultOpen={!isConfigured}>
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
                  defaultValue={url}
                  required
                  className="rounded-lg border-none bg-gray-200 px-3 py-2"
                />
              </Label>
              <Label label="Query">
                <textarea
                  name="query"
                  defaultValue={query}
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
                  defaultValue={path}
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
    </NodeViewWrapper>
  );
};
