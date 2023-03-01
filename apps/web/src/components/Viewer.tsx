import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

type ViewerProps = {
  json: JSONContent;
};

export const Viewer = ({ json }: ViewerProps) => {
  const html = generateHTML(json, [StarterKit]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
