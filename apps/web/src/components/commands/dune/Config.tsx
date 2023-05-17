import { NodeViewWrapper } from "@tiptap/react";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Badge } from "../../ui/badge";
import { Popover } from "../../ui/popover";
import { useBlockConfigProps } from "../../use-block-config-props";
import { BlockConfigButton, BlockConfigForm } from "../BlockConfig";
import { DuneProps } from "./Dune";

function formatHref(src: string) {
  if (src.startsWith("https://dune.com/embeds/")) {
    return src.replace("embeds", "queries");
  }

  return src;
}

function formatSrc(src: string) {
  if (src.startsWith("https://dune.com/queries/")) {
    return src.replace("queries", "embeds");
  }

  return src;
}

export const DuneConfig = (props: CommandExtensionProps<DuneProps>) => {
  const { isConfigured, isOpen, onSubmit, setOpen } = useBlockConfigProps(
    props,
    (key, value) => {
      if (key === "src") {
        return formatSrc(value);
      }

      return value;
    }
  );

  const { src } = props.node.attrs;

  return (
    <NodeViewWrapper>
      {isConfigured && (
        <div className="aspect-video">
          <iframe src={src} className="h-full w-full"></iframe>
        </div>
      )}
      <div className="flex items-start justify-start gap-2">
        {props.editor.isEditable && (
          <Popover
            defaultOpen={!isConfigured}
            onOpenChange={setOpen}
            open={isOpen}
          >
            <BlockConfigButton isConfigured={isConfigured}>
              settings
            </BlockConfigButton>
            <BlockConfigForm
              fields={[
                {
                  name: "src",
                  type: "text",
                  defaultValue: src,
                  placeholder: "https://dune.com/embeds/...",
                },
              ]}
              onSubmit={onSubmit}
            />
          </Popover>
        )}
        {isConfigured && (
          <Link href={formatHref(src)} target="_blank">
            <Badge variant="secondary">
              open <ExternalLink className="ml-1 h-3 w-3" />
            </Badge>
          </Link>
        )}
      </div>
    </NodeViewWrapper>
  );
};
