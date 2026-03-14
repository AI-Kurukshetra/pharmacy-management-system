import { Search, SlidersHorizontal } from "lucide-react";
import { PrescriptionQueue } from "@/components/prescriptions/PrescriptionQueue";
import { getPrescriptionsData } from "@/lib/server/data";

export default async function Page() {
  const rows = await getPrescriptionsData();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Prescription Queue</h1>
          <p className="mt-1 text-sm text-slate-600">Filling to verification to ready workflow with realtime updates</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"><Search className="h-4 w-4" /> Search Rx</button>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
        </div>
      </div>
      <PrescriptionQueue rows={rows as any} />
    </div>
  );
}
