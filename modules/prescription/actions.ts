"use server";

import { createClient } from "@/lib/supabase/server";
import { prescriptionSchema } from "./validation";

export async function createPrescription(input: unknown) {
  const parsed = prescriptionSchema.parse(input);
  const supabase = await createClient();
  return supabase.from("prescriptions").insert(parsed).select("*").single();
}
