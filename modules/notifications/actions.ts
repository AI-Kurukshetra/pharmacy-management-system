"use server";

import { createClient } from "@/lib/supabase/server";

export async function createNotification(input: Record<string, unknown>) {
  const supabase = await createClient();
  return supabase.from("notifications").insert(input).select("*").single();
}
