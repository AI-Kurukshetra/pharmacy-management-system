import { createClient } from "@/lib/supabase/server";

export async function listPatients() {
  const supabase = await createClient();
  return supabase.from("patients").select("*").order("created_at", { ascending: false });
}
