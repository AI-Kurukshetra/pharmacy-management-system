import { createClient } from "@/lib/supabase/server";

export async function listInventory() {
  const supabase = await createClient();
  return supabase
    .from("inventory_items")
    .select("*, medications(name)")
    .order("updated_at", { ascending: false });
}
