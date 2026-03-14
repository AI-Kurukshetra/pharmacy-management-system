export function PrescriptionForm() {
  return (
    <form className="shell-card grid gap-3 p-4 md:grid-cols-2 text-sm">
      <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Patient" />
      <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Physician" />
      <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Medication" />
      <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Quantity" />
      <textarea className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2" rows={3} placeholder="Directions" />
      <button className="rounded-lg bg-slate-900 px-3 py-2 text-white md:col-span-2">Save Prescription</button>
    </form>
  );
}
