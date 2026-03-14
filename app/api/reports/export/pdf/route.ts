import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function buildSimplePdfLikeContent(title: string, rows: Record<string, unknown>[]) {
  const lines = [
    `${title}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    ...rows.slice(0, 200).map((r) => JSON.stringify(r)),
  ];
  return lines.join("\n");
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const reportType = url.searchParams.get("report_type") ?? "operational";
  const pharmacyId = url.searchParams.get("pharmacy_id") ?? "global";
  const supabase = createAdminClient();

  const table =
    reportType === "financial" ? "transactions" :
    reportType === "inventory" ? "inventory_items" :
    reportType === "clinical" ? "clinical_notes" :
    reportType === "controlled-substances" ? "controlled_substance_ledger" :
    reportType === "compliance" ? "compliance_records" : "prescriptions";

  const { data, error } = await supabase.from(table).select("*").limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const contents = buildSimplePdfLikeContent(`${reportType.toUpperCase()} REPORT`, (data as Record<string, unknown>[]) ?? []);
  const blob = new Blob([contents], { type: "application/pdf" });
  const path = `${pharmacyId}/reports/${reportType}-${Date.now()}.pdf`;
  const upload = await supabase.storage.from("reports").upload(path, blob, { contentType: "application/pdf", upsert: true });
  if (upload.error) return NextResponse.json({ error: upload.error.message }, { status: 400 });

  const signed = await supabase.storage.from("reports").createSignedUrl(path, 3600);
  if (signed.error) return NextResponse.json({ error: signed.error.message }, { status: 400 });

  return NextResponse.json({ download_url: signed.data.signedUrl, path });
}
