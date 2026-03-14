import { getPaById } from "@/lib/server/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pa = await getPaById(id);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Prior Authorization Detail · {pa?.pa_number || id}</h1>
      <div className="shell-card grid gap-3 p-5 text-sm md:grid-cols-2">
        <p><span className="font-semibold">Status:</span> {pa?.status}</p>
        <p><span className="font-semibold">Initiated:</span> {pa?.initiated_date}</p>
        <p><span className="font-semibold">Decision Date:</span> {pa?.decision_date || "pending"}</p>
        <p><span className="font-semibold">Notes:</span> {pa?.notes || "-"}</p>
      </div>
    </div>
  );
}
