import { getPatientSubData } from "@/lib/server/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await getPatientSubData(id);
  const values = (d.adherence as any[]).map((a) => Math.round(Number(a.pdc_contribution || 0) * 100));

  return (
    <div className="space-y-4"><h1 className="text-xl font-semibold">Patient Adherence</h1><div className="shell-card p-4"><p className="text-sm text-slate-600">PDC trend</p><div className="mt-3 grid grid-cols-6 gap-2 items-end">{(values.length ? values : [0]).map((v,i)=><div key={i} className="rounded-t bg-teal-500/80" style={{height:`${v}px`}} />)}</div></div></div>
  );
}
