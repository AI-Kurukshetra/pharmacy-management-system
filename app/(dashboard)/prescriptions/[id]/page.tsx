import { getPrescriptionById } from "@/lib/server/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPrescriptionById(id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Prescription Detail · {p?.rx_number || id}</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="shell-card p-4"><p className="text-xs text-slate-500">Patient</p><p className="font-semibold">{p?.patients?.first_name} {p?.patients?.last_name}</p></div>
        <div className="shell-card p-4"><p className="text-xs text-slate-500">Medication</p><p className="font-semibold">{p?.medications?.name}</p></div>
        <div className="shell-card p-4"><p className="text-xs text-slate-500">Status</p><p className="font-semibold">{p?.status}</p></div>
      </div>
      <div className="shell-card p-4 text-sm text-slate-700">Directions: {p?.directions}</div>
    </div>
  );
}
