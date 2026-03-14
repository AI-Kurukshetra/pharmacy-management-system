export function FillTimeChart() {
  const bars = [14, 18, 16, 19, 15, 17];
  return (
    <div className="shell-card p-4">
      <p className="text-sm font-semibold">Avg Fill Time (min)</p>
      <div className="mt-3 grid grid-cols-6 items-end gap-2">
        {bars.map((h, i) => <div key={i} className="rounded-t bg-indigo-500/80" style={{ height: `${h * 5}px` }} />)}
      </div>
    </div>
  );
}
