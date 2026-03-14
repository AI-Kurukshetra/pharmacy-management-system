export function PatientForm() {
  return (
    <form className="shell-card grid gap-3 p-4 md:grid-cols-2 text-sm">
      <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="First name" />
      <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Last name" />
      <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="DOB" />
      <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Phone" />
      <button className="rounded-lg bg-slate-900 px-3 py-2 text-white md:col-span-2">Save Patient</button>
    </form>
  );
}
