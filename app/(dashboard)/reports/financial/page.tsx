import { KPICard } from "@/components/reports/KPICard";
import { getTransactionsData } from "@/lib/server/data";

export default async function Page() {
  const tx = await getTransactionsData();
  const gross = (tx as any[]).reduce((s, t) => s + Number(t.total_amount || 0), 0);
  const cogs = gross * 0.67;
  const net = gross - cogs;
  const margin = gross ? ((net / gross) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Financial Report</h1>
          <p className="mt-1 text-sm text-slate-600">Revenue, net, margin, and cost visibility.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Gross Revenue" value={`$${gross.toFixed(2)}`} />
        <KPICard label="Net Revenue" value={`$${net.toFixed(2)}`} />
        <KPICard label="COGS" value={`$${cogs.toFixed(2)}`} />
        <KPICard label="Margin" value={`${margin}%`} />
      </div>
    </div>
  );
}
