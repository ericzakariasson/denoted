import { NextApiRequest, NextApiResponse } from "next";
import { DeserializedPage } from "../../../utils/page-helper";
import { supabase } from "../../../lib/supabase/supabase";
import PinataSDK from "@pinata/sdk";
import * as Sentry from "@sentry/nextjs";

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

type Payload = {
  page: DeserializedPage;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { page } = JSON.parse(req.body) as Payload;

    const result = await pinata.pinJSONToIPFS(page, {
      pinataMetadata: {
        name: page.title,
      },
    });

    const insert = await supabase
      .from("page_publication")
      .insert({
        page_id: page.id,
        ipfs_cid: result.IpfsHash,
        page_title: page.title,
        publisher_address: page.createdBy.id.split(":")[4],
      })
      .select()
      .single();

    if (insert.error) {
      console.error(insert.error);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(insert.data);
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
