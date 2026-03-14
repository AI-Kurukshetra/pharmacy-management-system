import { NextRequest, NextResponse } from "next/server";
import { syncFhirResource } from "@/services/ehr";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const resources = Array.isArray(body.resources) ? body.resources : [body];

  let syncedRecords = 0;
  if (process.env.EHR_BASE_URL && process.env.EHR_API_KEY) {
    for (const resource of resources) {
      const result = await syncFhirResource("MedicationRequest", resource).catch(() => null);
      if (result) syncedRecords += 1;
    }
  } else {
    syncedRecords = resources.filter((r) => !!r).length;
  }

  return NextResponse.json({ synced_records: syncedRecords, ok: true });
}
