import { AlertTriangle, Clock3, ShieldCheck, TrendingUp } from "lucide-react";
import { KPICard } from "@/components/reports/KPICard";
import { getDashboardData } from "@/lib/server/data";

export default async function Page() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Live operations snapshot across prescriptions, claims, inventory, and compliance.</p>
        </div>
        <p className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">Realtime feed connected</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Prescriptions Today" value={String(data.prescriptions.length)} trend={`${data.metrics.queueSize} in active queue`} tone="good" />
        <KPICard label="Revenue" value={`$${data.metrics.revenue.toFixed(2)}`} trend="from recorded transactions" tone="good" />
        <KPICard label="Rejected Claims" value={String(data.metrics.rejectedClaims)} trend={`${data.claims.length} total claims`} tone="warn" />
        <KPICard label="Low Stock Items" value={String(data.metrics.lowStock)} trend={`${data.metrics.complianceAlerts} compliance alerts`} tone="warn" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className="shell-card p-5">
          <p className="text-sm font-semibold text-slate-900">7-Day Revenue Trend</p>
          <div className="mt-5 grid grid-cols-7 items-end gap-2.5">
            {[58, 71, 64, 83, 76, 88, 94].map((h, idx) => (
              <div key={idx} className="space-y-2 text-center">
                <div className="rounded-t-md bg-gradient-to-t from-blue-500 to-cyan-400" style={{ height: `${h * 1.4}px` }} />
                <p className="text-[10px] font-medium text-slate-500">D{idx + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="shell-card p-5">
          <p className="text-sm font-semibold text-slate-900">Operational Alerts</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {data.metrics.rejectedClaims} rejected claims need review</div>
            <div className="flex items-start gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-indigo-900"><Clock3 className="mt-0.5 h-4 w-4 shrink-0" /> Queue size: {data.metrics.queueSize}</div>
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> Compliance alerts: {data.metrics.complianceAlerts}</div>
            <div className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sky-900"><TrendingUp className="mt-0.5 h-4 w-4 shrink-0" /> Active patients: {data.patients.length}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
