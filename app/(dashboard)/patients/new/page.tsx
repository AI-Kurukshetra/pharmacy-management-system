export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Patient Profile</h1>
      <div className="shell-card grid gap-3 p-4 md:grid-cols-2">
        <label className="text-sm">First Name<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm">Last Name<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm">Date of Birth<input type="date" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm">Phone<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm md:col-span-2">Address<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white md:col-span-2">Create Patient</button>
      </div>
    </div>
  );
}
