const suppliers = [["Cardinal Health","Active","EDI"],["McKesson","Active","EDI"],["Independent Rx Supply","Active","Manual"]] as const;

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Suppliers</h1>
      <div className="shell-card overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-2">Supplier</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Ordering Mode</th></tr></thead><tbody>{suppliers.map(s=><tr key={s[0]} className="border-t border-slate-100"><td className="px-4 py-3 font-medium">{s[0]}</td><td className="px-4 py-3">{s[1]}</td><td className="px-4 py-3">{s[2]}</td></tr>)}</tbody></table></div>
    </div>
  );
}
