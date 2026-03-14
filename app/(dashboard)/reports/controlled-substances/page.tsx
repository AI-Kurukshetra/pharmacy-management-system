import { getCsLedgerData } from "@/lib/server/data";

export default async function Page() {
  const rows = await getCsLedgerData();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Controlled Substances Report</h1>
        <p className="mt-1 text-sm text-slate-600">Ledger visibility for controlled transaction monitoring.</p>
      </div>
      <div className="shell-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-2.5 sm:px-5">Type</th><th className="px-4 py-2.5 sm:px-5">Quantity</th><th className="px-4 py-2.5 sm:px-5">Balance</th></tr></thead>
            <tbody>{(rows as any[]).map((r) => <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/70"><td className="px-4 py-3.5 sm:px-5">{r.transaction_type}</td><td className="px-4 py-3.5 sm:px-5">{r.quantity}</td><td className="px-4 py-3.5 sm:px-5">{r.running_balance}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
