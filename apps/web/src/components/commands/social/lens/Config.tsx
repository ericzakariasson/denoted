import { NodeViewWrapper } from "@tiptap/react";

import { CommandExtensionProps } from "../../../../lib/tiptap/types";
import { Badge } from "../../../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { useCommandExtensionConfig } from "../../../use-command-extension-config";
import { ConfigForm } from "../../ConfigForm";
import { LensWidget, LensWidgetProps } from "./Lens";

const PLACEHOLDER = {
  handle: "ericz.lens",
  publicationId: "0x0f-0x01",
};

export const LensConfig = (props: CommandExtensionProps<LensWidgetProps>) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useCommandExtensionConfig(props);

  const { property, publicationId, handle } = props.node.attrs;

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
        <Popover
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <PopoverTrigger>
            {isConfigured ? (
              <LensWidget
                property={property}
                publicationId={publicationId}
                handle={handle}
              />
            ) : (
              <Badge variant={"outline"}>setup</Badge>
            )}
          </PopoverTrigger>
          <PopoverContent align="start">
            <ConfigForm
              fields={[
                {
                  name: property,
                  type: "text",
                  defaultValue: props.node.attrs[property],
                  placeholder: PLACEHOLDER[property],
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
