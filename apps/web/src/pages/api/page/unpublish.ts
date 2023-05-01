import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase/supabase";

type Payload = {
  pageId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { pageId } = JSON.parse(req.body) as Payload;

    const result = await supabase
      .from("page_publication")
      .delete()
      .eq("page_id", pageId);

    if (result.error) {
      console.error(result.error);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ data: result.data, sucess: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
}
