export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Create Purchase Order</h1>
      <div className="shell-card grid gap-3 p-4 md:grid-cols-2">
        <label className="text-sm">Supplier<select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option>Cardinal</option><option>McKesson</option></select></label>
        <label className="text-sm">Expected Date<input type="date" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm md:col-span-2">Line Items<textarea className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" rows={4} defaultValue="NDC, quantity, cost" /></label>
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white md:col-span-2">Create PO Draft</button>
      </div>
    </div>
  );
}
