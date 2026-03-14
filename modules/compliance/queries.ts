import { createClient } from "@/lib/supabase/server";

export async function listComplianceRecords() {
  const supabase = await createClient();
  return supabase
    .from("compliance_records")
    .select("*")
    .order("updated_at", { ascending: false });
}
