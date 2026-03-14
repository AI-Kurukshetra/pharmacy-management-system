import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type EdiItem = { ndc: string; quantity: number };
type EdiPayload = { po_number?: string; supplier_id?: string; items?: EdiItem[] };

serve(async (req) => {
  const body = (await req.json().catch(() => ({}))) as EdiPayload;
  const transactionId = crypto.randomUUID();

  return new Response(
    JSON.stringify({
      ok: true,
      edi_transaction_id: transactionId,
      transaction_type: "850",
      po_number: body.po_number ?? null,
      item_count: body.items?.length ?? 0,
      acknowledgment_expected: true,
    }),
    { headers: { "content-type": "application/json" } },
  );
});
