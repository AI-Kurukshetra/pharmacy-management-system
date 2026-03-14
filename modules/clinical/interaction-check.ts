export async function runInteractionCheck(payload: Record<string, unknown>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/drug-interaction-check`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("interaction check failed");
  return res.json();
}
