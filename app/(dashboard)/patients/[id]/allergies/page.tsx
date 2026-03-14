import { getPatientSubData } from "@/lib/server/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await getPatientSubData(id);

  return (
    <div className="space-y-4"><h1 className="text-xl font-semibold">Patient Allergies</h1><div className="shell-card p-4 text-sm"><ul className="list-disc pl-5 space-y-2">{(d.allergies as any[]).map((a)=> <li key={a.id}>{a.allergen} · {a.severity}</li>)}</ul></div></div>
  );
}
