export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Inventory Item</h1>
      <div className="shell-card grid gap-3 p-4 md:grid-cols-2">
        <label className="text-sm">NDC<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm">Medication<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm">Lot Number<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm">Quantity<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white md:col-span-2">Add Inventory</button>
      </div>
    </div>
  );
}
