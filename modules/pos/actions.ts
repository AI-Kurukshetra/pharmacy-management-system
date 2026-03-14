"use server";

import { createClient } from "@/lib/supabase/server";

export async function recordTransaction(input: Record<string, unknown>) {
  const supabase = await createClient();
  return supabase.from("transactions").insert(input).select("*").single();
}
