"use server";

import { createClient } from "@/lib/supabase/server";
import { inventoryAdjustmentSchema } from "./validation";

export async function adjustInventory(input: unknown) {
  const parsed = inventoryAdjustmentSchema.parse(input);
  const supabase = await createClient();
  return supabase.rpc("adjust_inventory", parsed);
}
