import { NodeViewWrapper } from "@tiptap/react";

import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Popover } from "../../ui/popover";
import { useBlockConfigProps } from "../../use-command-extension-config";
import { BlockConfigButton, BlockConfigForm } from "../BlockConfig";
import { TallyWidget, TallyWidgetProps } from "./Tally";

export const TallyConfig = (props: CommandExtensionProps<TallyWidgetProps>) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useBlockConfigProps(props);

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
          <BlockConfigButton isConfigured={isConfigured}>
            <TallyWidget query={query} path={path} />
          </BlockConfigButton>

          <BlockConfigForm
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
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
