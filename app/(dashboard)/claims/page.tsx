import { RefreshCcw, Send, ShieldAlert } from "lucide-react";
import { getClaimsData } from "@/lib/server/data";

function tone(status: string) {
  if (status === "approved") return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "rejected") return "border border-rose-200 bg-rose-50 text-rose-700";
  if (status === "submitted") return "border border-indigo-200 bg-indigo-50 text-indigo-700";
  return "border border-amber-200 bg-amber-50 text-amber-700";
}

export default async function Page() {
  const claims = await getClaimsData();
  const rejected = (claims as any[]).filter((c) => c.status === "rejected").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Claims Management</h1>
          <p className="mt-1 text-sm text-slate-600">NCPDP adjudication, rejections, resubmissions, and reversals</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="shell-card flex items-center gap-2.5 p-3.5 text-sm text-rose-800"><ShieldAlert className="h-4 w-4 shrink-0" /> {rejected} rejected claims need action</div>
        <div className="shell-card flex items-center gap-2.5 p-3.5 text-sm text-indigo-800"><Send className="h-4 w-4 shrink-0" /> {(claims as any[]).filter((c) => c.status === "submitted").length} claims in submitted state</div>
        <div className="shell-card flex items-center gap-2.5 p-3.5 text-sm text-slate-700 sm:col-span-2 xl:col-span-1"><RefreshCcw className="h-4 w-4 shrink-0" /> Last payer sync: live</div>
      </div>

      <div className="shell-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 sm:px-5">Claim#</th>
                <th className="px-4 py-2.5 sm:px-5">Status</th>
                <th className="px-4 py-2.5 sm:px-5">Billed</th>
                <th className="px-4 py-2.5 sm:px-5">Plan Pays</th>
                <th className="px-4 py-2.5 sm:px-5">Copay</th>
              </tr>
            </thead>
            <tbody>
              {(claims as any[]).map((c) => (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-semibold text-slate-900 sm:px-5">{c.claim_number}</td>
                  <td className="px-4 py-3.5 sm:px-5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone(c.status)}`}>{c.status}</span></td>
                  <td className="px-4 py-3.5 sm:px-5">{c.amount_billed}</td>
                  <td className="px-4 py-3.5 sm:px-5">{c.amount_approved}</td>
                  <td className="px-4 py-3.5 sm:px-5">{c.copay_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
