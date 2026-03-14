export function AdherenceChart() {
  const values = [78, 81, 84, 80, 86, 89];
  return (
    <div className="shell-card p-4">
      <p className="text-sm font-semibold">PDC Trend</p>
      <div className="mt-3 grid grid-cols-6 gap-2 items-end">{values.map((v, i) => <div key={i} className="rounded-t bg-teal-500/80" style={{ height: `${v}px` }} />)}</div>
    </div>
  );
}
