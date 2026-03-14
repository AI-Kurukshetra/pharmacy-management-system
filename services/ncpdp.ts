export function buildNcpdpClaim(payload: Record<string, unknown>) {
  return {
    version: "D.0",
    transaction_code: "B1",
    ...payload,
  };
}

export async function submitNcpdpClaim(payload: Record<string, unknown>) {
  const res = await fetch(`${process.env.NCPDP_BASE_URL || ""}/claims`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.NCPDP_API_KEY || ""}`,
    },
    body: JSON.stringify(buildNcpdpClaim(payload)),
  });
  if (!res.ok) throw new Error(`NCPDP submit failed: ${res.status}`);
  return res.json();
}
