import { getComplianceData } from "@/lib/server/data";

export default async function Page() {
  const rows = await getComplianceData();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Compliance</h1>
        <p className="mt-1 text-sm text-slate-600">Regulatory tasks, due dates, and operational status tracking.</p>
      </div>
      <div className="shell-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-2.5 sm:px-5">Type</th><th className="px-4 py-2.5 sm:px-5">Regulation</th><th className="px-4 py-2.5 sm:px-5">Status</th><th className="px-4 py-2.5 sm:px-5">Due</th></tr></thead>
            <tbody>{(rows as any[]).map((r) => <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/70"><td className="px-4 py-3.5 sm:px-5">{r.compliance_type}</td><td className="px-4 py-3.5 sm:px-5">{r.regulation_code}</td><td className="px-4 py-3.5 capitalize sm:px-5">{r.status}</td><td className="px-4 py-3.5 sm:px-5">{r.due_date}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
