import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type NotificationPayload = {
  id?: string;
  type?: "sms" | "email" | "in_app" | "push";
  subject?: string;
  body?: string;
  to?: string;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  const body = (await req.json().catch(() => ({}))) as NotificationPayload;
  const type = body.type ?? "in_app";

  let status = "sent";
  let provider = "in_app";

  if (type === "sms") {
    provider = "twilio";
    if (!Deno.env.get("TWILIO_ACCOUNT_SID") || !Deno.env.get("TWILIO_AUTH_TOKEN")) {
      status = "queued";
    }
  } else if (type === "email") {
    provider = "smtp";
    status = "queued";
  }

  return new Response(
    JSON.stringify({
      ok: true,
      notification_id: body.id ?? null,
      status,
      provider,
      to: body.to ?? null,
      preview: body.subject ?? body.body ?? "",
      timestamp: new Date().toISOString(),
    }),
    { headers: { "content-type": "application/json" } },
  );
});
