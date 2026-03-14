import { getMedicationsData } from "@/lib/server/data";

export default async function Page() {
  const rows = await getMedicationsData();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Medication Master</h1>
      <div className="shell-card overflow-hidden">
        <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-2">NDC</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">Class</th><th className="px-4 py-2">Schedule</th></tr></thead><tbody>{(rows as any[]).map((r) => <tr key={r.id} className="border-t border-slate-100"><td className="px-4 py-3">{r.ndc}</td><td className="px-4 py-3">{r.name}</td><td className="px-4 py-3">{r.drug_class}</td><td className="px-4 py-3">{r.schedule}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
