import { NodeViewWrapper } from "@tiptap/react";

import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Badge } from "../../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useCommandExtensionConfig } from "../../use-command-extension-config";
import { ConfigForm } from "../ConfigForm";
import { TallyWidget, TallyWidgetProps } from "./Tally";

export const TallyConfig = (props: CommandExtensionProps<TallyWidgetProps>) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useCommandExtensionConfig(props);

  const { query, path } = props.node.attrs;

  return (
    <NodeViewWrapper as="span">
      {isConfigured && !props.editor.isEditable && (
        <TallyWidget query={query} path={path} />
      )}
      {props.editor.isEditable && (
        <Popover
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <PopoverTrigger>
            {isConfigured ? (
              <TallyWidget query={query} path={path} />
            ) : (
              <Badge variant={"outline"}>setup</Badge>
            )}
          </PopoverTrigger>

          <PopoverContent align="start">
            <ConfigForm
              fields={[
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
