import { getPharmaciesData } from "@/lib/server/data";

export default async function Page() {
  const rows = await getPharmaciesData();
  const pharmacy = (rows as any[])[0];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Pharmacy Profile</h1>
      <div className="shell-card grid gap-2.5 p-5 text-sm md:grid-cols-2">
        <p><span className="font-semibold">Name:</span> {pharmacy?.name}</p>
        <p><span className="font-semibold">NPI:</span> {pharmacy?.npi}</p>
        <p><span className="font-semibold">DEA:</span> {pharmacy?.dea_number}</p>
        <p><span className="font-semibold">Phone:</span> {pharmacy?.phone}</p>
        <p className="md:col-span-2"><span className="font-semibold">Address:</span> {pharmacy?.address_line1}, {pharmacy?.city}, {pharmacy?.state} {pharmacy?.zip}</p>
      </div>
    </div>
  );
}
