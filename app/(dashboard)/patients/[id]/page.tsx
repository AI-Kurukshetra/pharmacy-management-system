import Link from "next/link";
import { getPatientById } from "@/lib/server/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPatientById(id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Patient Profile · {p?.first_name} {p?.last_name}</h1>
      <div className="grid gap-3 md:grid-cols-3 text-sm">
        <div className="shell-card p-4"><p className="text-slate-500">DOB</p><p className="font-semibold">{p?.date_of_birth}</p></div>
        <div className="shell-card p-4"><p className="text-slate-500">Phone</p><p className="font-semibold">{p?.phone}</p></div>
        <div className="shell-card p-4"><p className="text-slate-500">MRN</p><p className="font-semibold">{p?.mrn}</p></div>
      </div>
      <div className="grid gap-2 md:grid-cols-5 text-sm">
        <Link className="shell-card p-3" href={`/patients/${id}/prescriptions`}>Prescriptions</Link>
        <Link className="shell-card p-3" href={`/patients/${id}/allergies`}>Allergies</Link>
        <Link className="shell-card p-3" href={`/patients/${id}/insurance`}>Insurance</Link>
        <Link className="shell-card p-3" href={`/patients/${id}/adherence`}>Adherence</Link>
        <Link className="shell-card p-3" href={`/patients/${id}/clinical-notes`}>Clinical Notes</Link>
      </div>
    </div>
  );
}
