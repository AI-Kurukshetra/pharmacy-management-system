import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  const body = await req.json().catch(() => ({}));
  return new Response(
    JSON.stringify({
      function: "expiry-alert-job",
      ok: true,
      body,
      timestamp: new Date().toISOString(),
    }),
    { headers: { "content-type": "application/json" } },
  );
});
