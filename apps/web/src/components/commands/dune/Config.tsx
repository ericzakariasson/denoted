import { NodeViewWrapper } from "@tiptap/react";

import Link from "next/link";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Badge } from "../../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useCommandExtensionConfig } from "../../use-command-extension-config";
import { ConfigForm } from "../ConfigForm";
import { DuneProps } from "./Dune";
import { ExternalLink } from "lucide-react";

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
  const { isConfigured, isOpen, onSubmit, setOpen } = useCommandExtensionConfig(
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
        <div className="h-64 w-full">
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
            <PopoverTrigger>
              <Badge variant={"outline"}>
                {isConfigured ? "settings" : "setup"}
              </Badge>
            </PopoverTrigger>

            <PopoverContent sideOffset={5} align="start">
              <ConfigForm
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
            </PopoverContent>
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
