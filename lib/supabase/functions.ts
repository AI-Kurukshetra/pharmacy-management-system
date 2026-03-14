export async function invokeEdgeFunction<T = unknown>(name: string, payload: Record<string, unknown>) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return null;

  try {
    const res = await fetch(`${base}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
        apikey: key,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) return null;
    return json as T;
  } catch {
    return null;
  }
}

