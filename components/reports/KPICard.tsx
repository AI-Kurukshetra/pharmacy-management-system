import { cn } from "@/lib/utils";

export function KPICard({
  label,
  value,
  trend,
  tone = "default",
}: {
  label: string;
  value: string;
  trend?: string;
  tone?: "default" | "good" | "warn";
}) {
  return (
    <div className="shell-card p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      {trend ? (
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            tone === "good" && "text-blue-700",
            tone === "warn" && "text-amber-700",
            tone === "default" && "text-slate-600",
          )}
        >
          {trend}
        </p>
      ) : null}
    </div>
  );
}
