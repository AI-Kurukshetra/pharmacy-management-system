import { createClient } from "@/lib/supabase/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: m } = await supabase.from("medications").select("*").eq("id", id).single();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Medication Detail</h1>
      <div className="shell-card p-4 text-sm grid gap-2 md:grid-cols-2">
        <p><span className="font-semibold">NDC:</span> {m?.ndc}</p>
        <p><span className="font-semibold">Name:</span> {m?.name}</p>
        <p><span className="font-semibold">Class:</span> {m?.drug_class}</p>
        <p><span className="font-semibold">Schedule:</span> {m?.schedule}</p>
        <p><span className="font-semibold">Route:</span> {m?.route}</p>
        <p><span className="font-semibold">Strength:</span> {m?.strength}</p>
      </div>
    </div>
  );
}
