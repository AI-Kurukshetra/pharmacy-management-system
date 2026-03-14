"use server";

import { createClient } from "@/lib/supabase/server";

export async function createComplianceRecord(input: Record<string, unknown>) {
  const supabase = await createClient();
  return supabase.from("compliance_records").insert(input).select("*").single();
}
