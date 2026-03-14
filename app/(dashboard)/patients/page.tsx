import { Activity, Plus, Search } from "lucide-react";
import { getPatientsData } from "@/lib/server/data";

export default async function Page() {
  const patients = await getPatientsData();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Patients</h1>
          <p className="mt-1 text-sm text-slate-600">Profiles, allergies, insurance, adherence, and clinical notes</p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"><Plus className="h-4 w-4" /> New Patient</button>
      </div>

      <div className="shell-card p-4 sm:p-5">
        <div className="mb-4 flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-500 shadow-sm">
          <Search className="h-4 w-4" /> Search by name, MRN, phone
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-2.5 pr-4">Name</th>
                <th className="pb-2.5 pr-4">DOB</th>
                <th className="pb-2.5 pr-4">Phone</th>
                <th className="pb-2.5">MRN</th>
              </tr>
            </thead>
            <tbody>
              {(patients as any[]).map((p) => (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="py-3.5 pr-4 font-semibold text-slate-900">{p.first_name} {p.last_name}</td>
                  <td className="py-3.5 pr-4 text-slate-600">{p.date_of_birth}</td>
                  <td className="py-3.5 pr-4 text-slate-600">{p.phone}</td>
                  <td className="py-3.5">{p.mrn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="shell-card flex items-center gap-3 p-4 text-sm text-slate-700">
        <Activity className="h-4 w-4 text-blue-700" />
        {patients.length} active patient profiles loaded from Supabase.
      </div>
    </div>
  );
}
