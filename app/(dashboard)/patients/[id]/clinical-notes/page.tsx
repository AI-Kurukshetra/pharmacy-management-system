import { getPatientSubData } from "@/lib/server/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await getPatientSubData(id);

  return (
    <div className="space-y-4"><h1 className="text-xl font-semibold">Patient Clinical Notes</h1><div className="shell-card p-4 text-sm space-y-3">{(d.clinical as any[]).map((n)=> <div key={n.id}><p className="font-semibold">{n.note_type}</p><p className="text-slate-600">{n.note_text}</p></div>)}</div></div>
  );
}
