import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type MtmPayload = {
  patient_id?: string;
  medications?: Array<{ id: string; name?: string }>;
  adherence_gap?: boolean;
};

serve(async (req) => {
  const body = (await req.json().catch(() => ({}))) as MtmPayload;
  const recommendations = [
    "Review refill synchronization eligibility.",
    "Perform counseling for high-risk therapies.",
  ];

  if (body.adherence_gap) {
    recommendations.unshift("Start adherence intervention and refill reminder workflow.");
  }

  return new Response(
    JSON.stringify({
      ok: true,
      patient_id: body.patient_id ?? null,
      recommendations,
      medication_count: body.medications?.length ?? 0,
    }),
    { headers: { "content-type": "application/json" } },
  );
});
