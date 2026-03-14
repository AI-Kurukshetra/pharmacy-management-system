const steps = ["initiated", "submitted", "review", "approved"];

export function PATracker() {
  return (
    <div className="shell-card p-4">
      <p className="text-sm font-semibold">PA Tracker</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {steps.map((s, i) => (
          <span key={s} className={`rounded-full px-2 py-1 ${i < 2 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
