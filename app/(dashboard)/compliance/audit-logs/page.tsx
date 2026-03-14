import { getAuditLogsData } from "@/lib/server/data";

export default async function Page() {
  const logs = await getAuditLogsData();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-600">Traceability for critical actions across protected records.</p>
      </div>
      <div className="shell-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-2.5 sm:px-5">Action</th><th className="px-4 py-2.5 sm:px-5">Table</th><th className="px-4 py-2.5 sm:px-5">Record</th><th className="px-4 py-2.5 sm:px-5">Timestamp</th></tr></thead><tbody>{(logs as any[]).map((l) => <tr key={l.id} className="border-t border-slate-100 hover:bg-slate-50/70"><td className="px-4 py-3.5 sm:px-5">{l.action}</td><td className="px-4 py-3.5 sm:px-5">{l.table_name}</td><td className="px-4 py-3.5 sm:px-5">{l.record_id}</td><td className="px-4 py-3.5 sm:px-5">{l.created_at}</td></tr>)}</tbody></table>
        </div>
      </div>
    </div>
  );
}
