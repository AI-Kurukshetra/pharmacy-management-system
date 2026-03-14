import { getPrescriptionsData } from "@/lib/server/data";

export default async function Page() {
  const rx = await getPrescriptionsData();
  const queue = (rx as any[]).filter((r) => ["received", "filling", "verification", "ready"].includes(r.status));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Operational Report</h1>
        <p className="mt-1 text-sm text-slate-600">Queue throughput and fulfillment activity.</p>
      </div>
      <div className="shell-card p-5 text-sm text-slate-700">Active queue volume: {queue.length} · Total prescriptions: {rx.length}</div>
    </div>
  );
}
