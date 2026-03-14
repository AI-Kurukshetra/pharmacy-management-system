export async function lookupDrug(query: string) {
  const url = `${process.env.FDB_BASE_URL || ""}/drugs?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { authorization: `Bearer ${process.env.FDB_API_KEY || ""}` },
  });
  if (!res.ok) throw new Error(`FDB lookup failed: ${res.status}`);
  return res.json();
}
