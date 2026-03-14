import { NextRequest, NextResponse } from "next/server";
import { parseEdiAcknowledgment } from "@/services/edi";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = parseEdiAcknowledgment(body) as Record<string, unknown>;
  const poId = (body as Record<string, unknown>).po_id as string | undefined;
  let status = (body as Record<string, unknown>).status as string | undefined;
  status = status ?? "acknowledged";

  if (poId) {
    await createAdminClient()
      .from("purchase_orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", poId);
  }

  return NextResponse.json({ po_id: poId ?? null, status, parsed, ok: true });
}
