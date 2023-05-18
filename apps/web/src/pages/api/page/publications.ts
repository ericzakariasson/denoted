import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase/supabase";
import * as Sentry from "@sentry/nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { pageId } = req.query;

    const select = await supabase
      .from("page_publication")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("page_id", pageId);

    if (select.error) {
      console.error(select.error);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(select.data);
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
