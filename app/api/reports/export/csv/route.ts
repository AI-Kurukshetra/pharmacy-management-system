import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function toCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "message\nno_data\n";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const v = row[h];
          const s = v === null || v === undefined ? "" : String(v);
          const escaped = s.replace(/"/g, "\"\"");
          return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(","),
    ),
  ];
  return `${lines.join("\n")}\n`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const reportType = url.searchParams.get("report_type") ?? "financial";
  const pharmacyId = url.searchParams.get("pharmacy_id") ?? "global";
  const supabase = createAdminClient();

  const table =
    reportType === "financial" ? "transactions" :
    reportType === "inventory" ? "inventory_items" :
    reportType === "clinical" ? "adherence_records" :
    reportType === "controlled-substances" ? "controlled_substance_ledger" :
    reportType === "compliance" ? "compliance_records" : "prescriptions";

  const { data, error } = await supabase.from(table).select("*").limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const csv = toCsv((data as Record<string, unknown>[]) ?? []);
  const path = `${pharmacyId}/reports/${reportType}-${Date.now()}.csv`;
  const upload = await supabase.storage
    .from("reports")
    .upload(path, csv, { contentType: "text/csv", upsert: true });
  if (upload.error) return NextResponse.json({ error: upload.error.message }, { status: 400 });

  const signed = await supabase.storage.from("reports").createSignedUrl(path, 3600);
  if (signed.error) return NextResponse.json({ error: signed.error.message }, { status: 400 });

  return NextResponse.json({ download_url: signed.data.signedUrl, path });
}
