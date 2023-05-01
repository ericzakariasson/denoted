import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase/supabase";
import { DIDSession } from "did-session";

type Payload = {
  pageId: string;
  ceramicSession: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { pageId, ceramicSession } = JSON.parse(req.body) as Payload;

    const session = await DIDSession.fromSession(ceramicSession);

    if (!session.hasSession || session.isExpired) {
      return res.status(401).json({ success: false });
    }

    const publisherAddress = session.id.split(":")[4];

    const result = await supabase
      .from("page_publication")
      .delete()
      .eq("page_id", pageId)
      .eq("publisher_address", publisherAddress);

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
