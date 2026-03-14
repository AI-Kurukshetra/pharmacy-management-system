import { cn } from "@/lib/utils";

export function ClaimStatusBadge({ status }: { status: "pending" | "submitted" | "approved" | "rejected" | "reversed" }) {
  const cls = {
    pending: "border border-amber-200 bg-amber-50 text-amber-800",
    submitted: "border border-indigo-200 bg-indigo-50 text-indigo-700",
    approved: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border border-rose-200 bg-rose-50 text-rose-700",
    reversed: "border border-slate-200 bg-slate-50 text-slate-700",
  }[status];

  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", cls)}>{status}</span>;
}
