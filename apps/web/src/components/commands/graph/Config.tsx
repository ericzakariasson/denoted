import { NodeViewWrapper } from "@tiptap/react";

import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Label } from "../../Label";
import { Badge } from "../../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useCommandExtensionConfig } from "../../use-command-extension-config";
import { GraphWidget, GraphWidgetProps } from "./Graph";
import { ConfigForm } from "../ConfigForm";

type GraphComponentProps = CommandExtensionProps<GraphWidgetProps>;

export const GraphConfig = (props: GraphComponentProps) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useCommandExtensionConfig(props);

  const { url, query, path } = props.node.attrs;

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <GraphWidget url={url} query={query} path={path} />
      )}
      {props.editor.isEditable && (
        <Popover
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <PopoverTrigger>
            {isConfigured ? (
              <GraphWidget url={url} query={query} path={path} />
            ) : (
              <Badge variant={"outline"}>setup</Badge>
            )}
          </PopoverTrigger>

          <PopoverContent align="start">
            <ConfigForm
              fields={[
                {
                  name: "url",
                  type: "text",
                  defaultValue: url,
                  placeholder: "https://api.thegraph.com/subgraphs/name/...",
                },
                {
                  name: "query",
                  type: "textarea",
                  defaultValue: query,
                  placeholder: `query {
  foo {
    bar
  }
}`,
                },
                {
                  name: "path",
                  type: "text",
                  defaultValue: path,
                  placeholder: "foo.bar",
                },
              ]}
              onSubmit={onSubmit}
            />
          </PopoverContent>
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
