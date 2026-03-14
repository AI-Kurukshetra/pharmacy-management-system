import { CalendarClock, FileCheck2 } from "lucide-react";
import { getPaData } from "@/lib/server/data";

export default async function Page() {
  const pas = await getPaData();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Prior Authorizations</h1>
        <p className="mt-1 text-sm text-slate-600">Track PA lifecycle, appeal windows, and payer outcomes</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="shell-card flex items-center gap-2.5 p-3.5 text-sm text-amber-800"><CalendarClock className="h-4 w-4 shrink-0" /> {(pas as any[]).filter((p) => p.status !== "approved").length} submissions require follow-up</div>
        <div className="shell-card flex items-center gap-2.5 p-3.5 text-sm text-emerald-800"><FileCheck2 className="h-4 w-4 shrink-0" /> {(pas as any[]).filter((p) => p.status === "approved").length} approvals received</div>
      </div>

      <div className="shell-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-2.5 sm:px-5">PA#</th><th className="px-4 py-2.5 sm:px-5">Status</th><th className="px-4 py-2.5 sm:px-5">Notes</th></tr>
            </thead>
            <tbody>
              {(pas as any[]).map((p) => (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/70"><td className="px-4 py-3.5 font-semibold text-slate-900 sm:px-5">{p.pa_number}</td><td className="px-4 py-3.5 capitalize sm:px-5">{p.status}</td><td className="px-4 py-3.5 sm:px-5">{p.notes}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
