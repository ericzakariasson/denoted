import * as dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";
import { Database } from "../src/lib/supabase/supabase.types";
import PinataSDK from "@pinata/sdk";

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

const supabase = createClient<Database>(
  process.env.SUPABASE_API_URL as string,
  process.env.SUPABASE_API_KEY as string
);

async function fetchPage(cid: string) {
  const res = await fetch(`https://cloudflare-ipfs.com/ipfs/${cid}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch image with CID ${cid} from IPFS`);
  }

  return await res.json();
}

async function traverseBlocks(blocks: any[], callback: (block: any) => void) {
  return await Promise.all(
    blocks.map(async (block: any) => {
      if (block.content) {
        await traverseBlocks(block.content, callback);
      }
      await callback(block);
    })
  );
}

(async () => {
  const { data: latestPublishedPages } = await supabase
    .from("latest_page_publication")
    .select("id, ipfs_cid")
    .order("created_at", { ascending: false });

  if (!latestPublishedPages) {
    throw new Error("Failed to fetch latest published pages");
  }

  const usedCids = new Set<string>();

  for (const { ipfs_cid } of latestPublishedPages) {
    const page = await fetchPage(ipfs_cid);

    await traverseBlocks(
      page.data,
      async (block: any) => {
        if (block?.type === "ipfs-image") {
          usedCids.add(block!.attrs!.cid);
        }
      }
    )
  }

  const latestPublishedPageIds = latestPublishedPages.map(({ id }) => id);

  const { data: oldPublishedPages } = await supabase
    .from("page_publication")
    .select("id, ipfs_cid, page_id")
    .not("id", "in", `(${latestPublishedPageIds.join(",")})`);

  if (!oldPublishedPages) {
    throw new Error("Failed to fetch old published pages");
  }

  const unpinnedCids = new Set<string>();

  for (const { id, ipfs_cid, page_id } of oldPublishedPages) {
    const page = await fetchPage(ipfs_cid);
    
    await traverseBlocks(
      page.data,
      async (block: any) => {
        if (block?.type === "ipfs-image") {
          const { cid } = block!.attrs;
          if (!usedCids.has(cid) && !unpinnedCids.has(cid)) {
            console.log(`Unpinning file with CID ${cid} for page ${page_id}`);
            await pinata.unpin(cid);
          }
          unpinnedCids.add(cid);
        }
      }
    );

    console.log(`Unpinning & deleting page with CID ${ipfs_cid} and page ID ${page_id}`);

    await Promise.allSettled([
      pinata.unpin(ipfs_cid),
      supabase
        .from("page_publication")
        .delete()
        .eq("id", id)
    ]);
  }
})();


// CREATE OR REPLACE VIEW latest_page_publication AS
//   SELECT DISTINCT ON (page_id) page_id,
//     id,
//     ipfs_cid,
//     created_at,
//     page_title,
//     publisher_address
//   FROM page_publication
//   ORDER BY page_id, created_at DESC;