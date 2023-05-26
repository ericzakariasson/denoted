import * as dotenv from "dotenv";
dotenv.config();
import pMap from "p-map";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import PinataSDK from "@pinata/sdk";
import { Database } from "../../../apps/web/src/lib/supabase/supabase.types";

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

const supabase = createClient<Database>(
  process.env.SUPABASE_API_URL as string,
  process.env.SUPABASE_API_KEY as string,
);

async function fetchPage(cid: string) {
  const res = await fetch(`https://cloudflare-ipfs.com/ipfs/${cid}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch page with CID ${cid} from IPFS`);
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

  const usedCids = new Set<string>([
    "QmUr5sygQ8tG8wkVS3EaMn2JvB83nsj1deQeFkA8ack8na",
    "QmaEZ6NmcpMSDDVzv4cS2Qm8ybd8Vt6AJYkxxHFGg7ZWhd",
    "QmQJzywKkrS5AC7dEAiSsx8mvsWbBHxHW5dJxiqSkMSdKo",
  ]);

  await pMap(
    latestPublishedPages,
    async ({ ipfs_cid }) => {
      const page = await fetchPage(ipfs_cid);

      await traverseBlocks(
        page.data,
        async (block: any) => {
          if (block?.type === "ipfs-image") {
            usedCids.add(block!.attrs!.cid);
          }
        }
      )
    },
    { concurrency: 2 }
  );

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

    console.log(`[${id}] Deleting page with page ID ${page_id}`);
    const deleteResults = await supabase
      .from("page_publication")
      .delete()
      .eq("id", id);
    console.log(JSON.stringify(deleteResults));

    if (deleteResults.error) {
      throw new Error(deleteResults.error.message);
    }

    console.log(`[${id}] Unpinning page with CID ${ipfs_cid}`);
    const unpinResults = await pinata.unpin(ipfs_cid);
    console.log(JSON.stringify(unpinResults));
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