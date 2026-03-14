export function RevenueChart() {
  const bars = [62, 71, 68, 77, 83, 79, 90];
  return (
    <div className="shell-card p-4">
      <p className="text-sm font-semibold">Revenue Trend</p>
      <div className="mt-3 grid grid-cols-7 items-end gap-2">
        {bars.map((h, i) => <div key={i} className="rounded-t bg-teal-500/80" style={{ height: `${h}px` }} />)}
      </div>
    </div>
  );
}
