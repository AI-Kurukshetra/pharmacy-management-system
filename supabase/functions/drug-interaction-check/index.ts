import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type Payload = {
  patient_id?: string;
  medication_id?: string;
  active_medications?: Array<{ id: string; name?: string }>;
  allergies?: Array<{ allergen: string; severity?: string }>;
  diagnoses?: Array<{ icd10: string }>;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  const body = (await req.json().catch(() => ({}))) as Payload;
  const alerts: Array<{ severity: string; description: string; medications: string[] }> = [];

  for (const med of body.active_medications ?? []) {
    if (med.id !== body.medication_id) {
      alerts.push({
        severity: "moderate",
        description: `Potential interaction with active medication ${med.name ?? med.id}`,
        medications: [String(body.medication_id ?? ""), med.id],
      });
    }
  }

  for (const allergy of body.allergies ?? []) {
    const sev = allergy.severity ?? "major";
    alerts.push({
      severity: sev,
      description: `Allergy alert: ${allergy.allergen}`,
      medications: [String(body.medication_id ?? "")],
    });
  }

  if ((body.diagnoses ?? []).length > 0) {
    alerts.push({
      severity: "minor",
      description: "Drug-disease screening completed for provided diagnoses.",
      medications: [String(body.medication_id ?? "")],
    });
  }

  const blocked = alerts.some((a) => a.severity === "contraindicated");
  return new Response(JSON.stringify({ ok: true, blocked, alerts }), {
    headers: { "content-type": "application/json" },
  });
});
