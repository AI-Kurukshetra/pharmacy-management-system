const rows = [["5931-4401","Apixaban 5mg","LOT-P55",12,"2026-03-30"],["5486-1120","Metformin 500mg","LOT-K11",21,"2026-04-01"]] as const;

export function InventoryTable() {
  return (
    <div className="shell-card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-2">NDC</th><th className="px-4 py-2">Medication</th><th className="px-4 py-2">Lot</th><th className="px-4 py-2">Qty</th><th className="px-4 py-2">Expiry</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]+r[2]} className="border-t border-slate-100"><td className="px-4 py-3 font-medium">{r[0]}</td><td className="px-4 py-3">{r[1]}</td><td className="px-4 py-3">{r[2]}</td><td className="px-4 py-3">{r[3]}</td><td className="px-4 py-3">{r[4]}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
