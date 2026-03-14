export async function syncFhirResource(resourceType: string, body: unknown) {
  const res = await fetch(`${process.env.EHR_BASE_URL || ""}/${resourceType}`, {
    method: "POST",
    headers: {
      "content-type": "application/fhir+json",
      authorization: `Bearer ${process.env.EHR_API_KEY || ""}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`EHR sync failed: ${res.status}`);
  return res.json();
}
