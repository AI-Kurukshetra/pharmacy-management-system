import { getPatientSubData } from "@/lib/server/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await getPatientSubData(id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Patient Prescriptions</h1>
      <div className="shell-card overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-2">Rx#</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Date</th></tr></thead><tbody>{(d.prescriptions as any[]).map((r)=><tr key={r.id} className="border-t border-slate-100"><td className="px-4 py-3 font-medium">{r.rx_number}</td><td className="px-4 py-3">{r.status}</td><td className="px-4 py-3">{r.written_date}</td></tr>)}</tbody></table></div>
    </div>
  );
}
