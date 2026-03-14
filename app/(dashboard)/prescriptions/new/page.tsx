export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Prescription</h1>
      <div className="shell-card grid gap-3 p-4 md:grid-cols-2">
        <label className="text-sm">Patient<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Search patient" /></label>
        <label className="text-sm">Physician<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="NPI / name" /></label>
        <label className="text-sm">Medication<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="NDC / medication" /></label>
        <label className="text-sm">Origin<select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option>electronic</option><option>written</option><option>phone</option><option>fax</option></select></label>
        <label className="text-sm">Quantity<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" defaultValue="30" /></label>
        <label className="text-sm">Days Supply<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" defaultValue="30" /></label>
        <label className="text-sm md:col-span-2">Directions<textarea className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" rows={3} defaultValue="Take 1 tablet by mouth once daily" /></label>
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white md:col-span-2">Run Interaction Check & Save Rx</button>
      </div>
    </div>
  );
}
