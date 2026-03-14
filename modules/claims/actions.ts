"use server";

import { submitNcpdpClaim } from "@/services/ncpdp";

export async function submitClaim(payload: Record<string, unknown>) {
  return submitNcpdpClaim(payload);
}
