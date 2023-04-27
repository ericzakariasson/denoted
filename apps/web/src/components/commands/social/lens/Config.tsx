import { NodeViewWrapper } from "@tiptap/react";

import { CommandExtensionProps } from "../../../../lib/tiptap/types";
import { Popover } from "../../../ui/popover";
import { useBlockConfigProps } from "../../../use-command-extension-config";
import { BlockConfigButton, BlockConfigForm } from "../../BlockConfig";
import { LensWidget, LensWidgetProps } from "./Lens";

const PLACEHOLDER = {
  handle: "ericz.lens",
  publicationId: "0x0f-0x01",
};

export const LensConfig = (props: CommandExtensionProps<LensWidgetProps>) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useBlockConfigProps(props);

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
          <BlockConfigButton isConfigured={isConfigured}>
            <LensWidget
              property={property}
              publicationId={publicationId}
              handle={handle}
            />
          </BlockConfigButton>
          <BlockConfigForm
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
        </Popover>
      )}
    </NodeViewWrapper>
  );
};
