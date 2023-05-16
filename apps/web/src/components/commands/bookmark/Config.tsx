import { NodeViewWrapper } from "@tiptap/react";

import { MoreHorizontal } from "lucide-react";
import { useQuery } from "react-query";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Popover, PopoverTrigger } from "../../ui/popover";
import { useBlockConfigProps } from "../../use-block-config-props";
import { BlockConfigForm } from "../BlockConfig";
import { BookmarkProps } from "./bookmark";

export interface OpenGraphPreviewData {
  url: string;
  title: string;
  siteName: string;
  description: string;
  mediaType: string;
  contentType: string;
  images: string[];
  videos: unknown[];
  favicons: string[];
}

function isValidHttpUrl(url: string) {
  try {
    const _url = new URL(url);
    return _url.protocol === "http:" || _url.protocol === "https:";
  } catch {
    return false;
  }
}

export const BookmarkConfig = (props: CommandExtensionProps<BookmarkProps>) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useBlockConfigProps(props);

  const { src } = props.node.attrs;

  const isValid = src ? isValidHttpUrl(src) : false;

  const linkPreviewQuery = useQuery(
    ["OPEN_GRAPH", src],
    async () => {
      const response = await fetch("/api/get-og-data?url=" + src);

      const data = await response.json();

      return data as OpenGraphPreviewData;
    },
    { enabled: isValid }
  );

  const image = linkPreviewQuery.data?.images[0] ?? null;

  return (
    <NodeViewWrapper as="div">
      <div
        className="group relative my-4"
        contentEditable={false}
        data-drag-handle
        draggable={true}
      >
        {props.editor.isEditable && (
          <Popover
            defaultOpen={!isConfigured}
            onOpenChange={setOpen}
            open={isOpen}
          >
            <PopoverTrigger className="absolute right-2 top-2 rounded-sm border bg-white p-2 opacity-0 hover:bg-slate-100 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </PopoverTrigger>
            <BlockConfigForm
              align="end"
              fields={[
                {
                  name: "src",
                  type: "text",
                  label: "URL",
                  defaultValue: src,
                  placeholder: "https://",
                },
              ]}
              onSubmit={onSubmit}
            />
          </Popover>
        )}
        {linkPreviewQuery.data && (
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className=" flex w-full overflow-hidden rounded-md border no-underline hover:bg-slate-50"
          >
            <div className="flex w-2/3 flex-col gap-1 p-4">
              <p className="m-0 truncate text-ellipsis ">
                {linkPreviewQuery.data?.title}
              </p>
              <p className="m-0 line-clamp-2 text-sm font-normal text-slate-500">
                {linkPreviewQuery.data?.description}
              </p>
              <p className="m-0 mt-2 flex items-center gap-2">
                <img
                  width={16}
                  height={16}
                  src={linkPreviewQuery.data?.favicons.at(0) ?? ""}
                  alt="Favicon"
                  className="m-0"
                />
                <span className="text-xs font-normal text-slate-400">
                  {linkPreviewQuery.data?.url}
                </span>
              </p>
            </div>
            <div
              style={{ backgroundImage: `url(${image})` }}
              className="w-1/3 bg-cover"
            />
          </a>
        )}
      </div>
    </NodeViewWrapper>
  );
};
