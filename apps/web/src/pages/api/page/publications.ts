import { NextApiRequest, NextApiResponse } from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pageId } = req.query;

  // fetch CID from db by pageId

  return res.status(404);
}
