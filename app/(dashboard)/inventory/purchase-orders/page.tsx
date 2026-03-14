const rows = [["PO-7701","Cardinal","submitted","2026-03-14","$3,440"],["PO-7700","McKesson","received","2026-03-11","$7,210"]] as const;

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Purchase Orders</h1>
      <div className="shell-card overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-2">PO#</th><th className="px-4 py-2">Supplier</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Date</th><th className="px-4 py-2">Total</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]} className="border-t border-slate-100"><td className="px-4 py-3 font-medium">{r[0]}</td><td className="px-4 py-3">{r[1]}</td><td className="px-4 py-3">{r[2]}</td><td className="px-4 py-3">{r[3]}</td><td className="px-4 py-3">{r[4]}</td></tr>)}</tbody></table></div>
    </div>
  );
}
