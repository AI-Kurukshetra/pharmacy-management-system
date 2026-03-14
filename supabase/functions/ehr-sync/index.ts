import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type SyncPayload = { resources?: unknown[]; source?: string };

serve(async (req) => {
  const body = (await req.json().catch(() => ({}))) as SyncPayload;
  const synced = Array.isArray(body.resources) ? body.resources.length : 0;

  return new Response(
    JSON.stringify({
      ok: true,
      source: body.source ?? "fhir",
      synced_records: synced,
      timestamp: new Date().toISOString(),
    }),
    { headers: { "content-type": "application/json" } },
  );
});
