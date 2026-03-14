import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type ClaimPayload = {
  claim_id?: string;
  prescription_id?: string;
  patient_insurance_id?: string;
  amount_billed?: number;
  override_copay?: number;
  force_reject?: boolean;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  const body = (await req.json().catch(() => ({}))) as ClaimPayload;
  const billed = Number(body.amount_billed ?? 0);

  const rejected = Boolean(body.force_reject) || billed <= 0;
  const approved = rejected ? 0 : Number((billed * 0.8).toFixed(2));
  const copay = rejected
    ? 0
    : Number(
        (body.override_copay !== undefined ? Number(body.override_copay) : billed - approved).toFixed(2),
      );

  const response = {
    claim_id: body.claim_id ?? null,
    transaction: "NCPDP D.0 B1",
    status: rejected ? "rejected" : "approved",
    adjudication: {
      approved,
      copay,
      reject_codes: rejected ? ["79"] : [],
    },
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify({ ok: true, ncpdp_response: response }), {
    headers: { "content-type": "application/json" },
  });
});
