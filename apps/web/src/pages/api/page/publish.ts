import { NextApiRequest, NextApiResponse } from "next";
import { DeserializedPage } from "../../../utils/page-helper";

type Payload = {
  page: DeserializedPage;
};

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page } = JSON.parse(req.body) as Payload;
  console.log(page);
  // upload to ipfs
  // save cid to to db
  return res.status(404);
}
