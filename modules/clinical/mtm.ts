export async function runMtmAnalysis(payload: Record<string, unknown>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ai-mtm-analysis`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("mtm analysis failed");
  return res.json();
}
