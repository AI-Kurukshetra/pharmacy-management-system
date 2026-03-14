import { AlertTriangle, ClipboardCheck, PackageSearch } from "lucide-react";
import { getInventoryData } from "@/lib/server/data";

export default async function Page() {
  const rows = await getInventoryData();
  const low = (rows as any[]).filter((r) => Number(r.quantity_on_hand || 0) <= Number(r.reorder_point || 0)).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Inventory</h1>
        <p className="mt-1 text-sm text-slate-600">Stock, expiry, reorder points, and controlled substance monitoring</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="shell-card flex items-center gap-2.5 p-3.5 text-sm text-amber-900"><AlertTriangle className="h-4 w-4 shrink-0" /> {low} items below reorder point</div>
        <div className="shell-card flex items-center gap-2.5 p-3.5 text-sm text-rose-900"><PackageSearch className="h-4 w-4 shrink-0" /> {(rows as any[]).filter((r) => r.expiration_date).length} tracked expiry lots</div>
        <div className="shell-card flex items-center gap-2.5 p-3.5 text-sm text-emerald-900 sm:col-span-2 xl:col-span-1"><ClipboardCheck className="h-4 w-4 shrink-0" /> Last cycle count reconciled</div>
      </div>

      <div className="shell-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 sm:px-5">NDC</th>
                <th className="px-4 py-2.5 sm:px-5">Medication</th>
                <th className="px-4 py-2.5 sm:px-5">Lot</th>
                <th className="px-4 py-2.5 sm:px-5">Qty</th>
                <th className="px-4 py-2.5 sm:px-5">Expiry</th>
                <th className="px-4 py-2.5 sm:px-5">Reorder Pt</th>
                <th className="px-4 py-2.5 sm:px-5">Location</th>
              </tr>
            </thead>
            <tbody>
              {(rows as any[]).map((r) => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-semibold text-slate-900 sm:px-5">{r.ndc}</td>
                  <td className="px-4 py-3.5 sm:px-5">{r.medications?.name}</td>
                  <td className="px-4 py-3.5 text-slate-600 sm:px-5">{r.lot_number}</td>
                  <td className="px-4 py-3.5 sm:px-5">{r.quantity_on_hand}</td>
                  <td className="px-4 py-3.5 sm:px-5">{r.expiration_date}</td>
                  <td className="px-4 py-3.5 sm:px-5">{r.reorder_point}</td>
                  <td className="px-4 py-3.5 text-slate-600 sm:px-5">{r.storage_location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
