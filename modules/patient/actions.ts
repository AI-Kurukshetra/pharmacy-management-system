"use server";

import { createClient } from "@/lib/supabase/server";
import { patientSchema } from "./validation";

export async function createPatient(input: unknown) {
  const parsed = patientSchema.parse(input);
  const supabase = await createClient();
  return supabase.from("patients").insert(parsed).select("*").single();
}
