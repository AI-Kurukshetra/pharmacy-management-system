import { createClient } from "@/lib/supabase/server";

export async function listClaims() {
  const supabase = await createClient();
  return supabase.from("claims").select("*").order("created_at", { ascending: false });
}
