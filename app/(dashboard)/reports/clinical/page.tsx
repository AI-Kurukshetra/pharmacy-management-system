import { getClinicalNotesData, getAdherenceData } from "@/lib/server/data";

export default async function Page() {
  const [notes, adherence] = await Promise.all([getClinicalNotesData(), getAdherenceData()]);
  const gaps = (adherence as any[]).filter((r) => r.is_gap).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Clinical Report</h1>
        <p className="mt-1 text-sm text-slate-600">Patient outcomes, intervention notes, and adherence insight.</p>
      </div>
      <div className="shell-card p-5 text-sm text-slate-700">Clinical notes: {notes.length} · Adherence gaps: {gaps}</div>
    </div>
  );
}
