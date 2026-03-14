import { getInventoryData } from "@/lib/server/data";

export default async function Page() {
  const inv = await getInventoryData();
  const low = (inv as any[]).filter((i) => Number(i.quantity_on_hand || 0) <= Number(i.reorder_point || 0)).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Inventory Report</h1>
        <p className="mt-1 text-sm text-slate-600">SKU coverage, reorder risk, and stock health.</p>
      </div>
      <div className="shell-card p-5 text-sm text-slate-700">Tracked SKUs: {inv.length} · Low stock: {low}</div>
    </div>
  );
}
