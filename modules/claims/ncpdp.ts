import { buildNcpdpClaim } from "@/services/ncpdp";

export function buildClaimPayload(input: Record<string, unknown>) {
  return buildNcpdpClaim(input);
}
