import Link from "next/link";

const cards = [
  ["Financial", "/reports/financial", "Revenue, margin, COGS, payer mix"],
  ["Operational", "/reports/operational", "Fill time, queue throughput, staffing"],
  ["Clinical", "/reports/clinical", "Interaction alerts, MTM outcomes, adherence"],
  ["Inventory", "/reports/inventory", "Turns, expiries, reorder performance"],
  ["Controlled Substances", "/reports/controlled-substances", "Ledger and reconciliation"],
] as const;

export default function Page() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-600">Choose a reporting workspace</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link key={c[0]} href={c[1]} className="shell-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-base font-semibold text-slate-900">{c[0]}</p>
            <p className="mt-1.5 text-sm text-slate-600">{c[2]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
