import { NextApiRequest, NextApiResponse } from "next";
import { DeserializedPage } from "../../../utils/page-helper";
import { supabase } from "../../../lib/supabase";

type Payload = {
  page: DeserializedPage;
};

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page } = JSON.parse(req.body) as Payload;
  console.log(page);
  // upload to ipfs
  // save cid to to db
  const insert = await supabase.from("page_publication").insert({
    page_id: page.id,
    ipfs_cid: "",
  });

  if (insert.error) {
    console.error(insert.error);
    return res.status(500);
  }

  return res.status(404);
}
