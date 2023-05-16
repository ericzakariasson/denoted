import { NextApiRequest, NextApiResponse } from "next";
import { getLinkPreview } from "link-preview-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = new URL(req.query.url?.toString() ?? "");

  const preview = await getLinkPreview(url.href);
  return res.status(200).json(preview);
}
