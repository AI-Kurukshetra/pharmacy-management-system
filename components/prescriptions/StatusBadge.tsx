import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: "received" | "filling" | "verification" | "ready" | "dispensed" | "rejected" }) {
  const map = {
    received: "border border-slate-200 bg-slate-50 text-slate-700",
    filling: "border border-amber-200 bg-amber-50 text-amber-800",
    verification: "border border-indigo-200 bg-indigo-50 text-indigo-700",
    ready: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    dispensed: "border border-cyan-200 bg-cyan-50 text-cyan-700",
    rejected: "border border-rose-200 bg-rose-50 text-rose-700",
  };

  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", map[status])}>{status}</span>;
}
