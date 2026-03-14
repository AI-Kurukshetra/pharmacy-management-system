import { getPatientSubData } from "@/lib/server/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await getPatientSubData(id);
  const i = (d.insurance as any[])[0];

  return (
    <div className="space-y-4"><h1 className="text-xl font-semibold">Patient Insurance</h1><div className="shell-card grid gap-2 p-4 text-sm md:grid-cols-2"><p><span className="font-semibold">Member ID:</span> {i?.member_id}</p><p><span className="font-semibold">BIN:</span> {i?.bin_number}</p><p><span className="font-semibold">PCN:</span> {i?.pcn}</p><p><span className="font-semibold">Primary:</span> {String(i?.is_primary)}</p></div></div>
  );
}
