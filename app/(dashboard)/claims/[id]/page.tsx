import { getClaimById } from "@/lib/server/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getClaimById(id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Claim Detail · {c?.claim_number || id}</h1>
        <p className="mt-1 text-sm text-slate-600">Status: {c?.status}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="shell-card p-5"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Amount Billed</p><p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{c?.amount_billed ?? "-"}</p></div>
        <div className="shell-card p-5"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Plan Pays</p><p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{c?.amount_approved ?? "-"}</p></div>
        <div className="shell-card p-5 sm:col-span-2 xl:col-span-1"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Copay</p><p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{c?.copay_amount ?? "-"}</p></div>
      </div>
    </div>
  );
}
