import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { pageId } = req.query;

    const select = await supabase
      .from("page_publication")
      .select("*")
      .eq("page_id", pageId);

    if (select.error) {
      console.error(select.error);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(select.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
}
