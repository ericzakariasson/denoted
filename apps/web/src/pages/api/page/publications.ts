import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pageId } = req.query;

  const select = await supabase
    .from("page_publication")
    .select("*")
    .eq("page_id", pageId);

  if (select.error) {
    console.error(select.error);
    return res.status(500);
  }

  return res.status(200).json(select.data);
}
