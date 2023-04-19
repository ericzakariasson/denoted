import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase.types";

export const supabase = createClient<Database>(
  process.env.SUPABASE_API_URL as string,
  process.env.SUPABASE_API_KEY as string
);
