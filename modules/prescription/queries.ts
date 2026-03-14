import { createClient } from "@/lib/supabase/server";

export async function listPrescriptionQueue() {
  const supabase = await createClient();
  return supabase
    .from("prescriptions")
    .select("*, patients(first_name,last_name), medications(name)")
    .in("status", ["received", "filling", "verification", "ready"])
    .order("created_at", { ascending: false });
}
