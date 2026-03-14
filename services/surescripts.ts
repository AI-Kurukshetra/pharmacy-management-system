export async function sendToSurescripts(path: string, payload: unknown) {
  const res = await fetch(`${process.env.SURESCRIPTS_BASE_URL || ""}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.SURESCRIPTS_API_KEY || ""}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Surescripts error: ${res.status}`);
  return res.json();
}
