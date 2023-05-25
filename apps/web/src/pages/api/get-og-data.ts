import { NextApiRequest, NextApiResponse } from "next";
import { getLinkPreview } from "link-preview-js";
import * as Sentry from "@sentry/nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = new URL(req.query.url?.toString() ?? "");

    const preview = await getLinkPreview(url.href, {
      followRedirects: "follow",
    });
    return res.status(200).json(preview);
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    } else {
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
}
