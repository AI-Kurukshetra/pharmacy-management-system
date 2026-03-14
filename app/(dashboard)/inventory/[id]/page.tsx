import { getInventoryById } from "@/lib/server/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = await getInventoryById(id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Inventory Detail</h1>
      <div className="shell-card grid gap-2 p-4 text-sm md:grid-cols-2">
        <p><span className="font-semibold">NDC:</span> {i?.ndc}</p>
        <p><span className="font-semibold">Medication:</span> {i?.medications?.name}</p>
        <p><span className="font-semibold">Lot:</span> {i?.lot_number}</p>
        <p><span className="font-semibold">Qty On Hand:</span> {i?.quantity_on_hand}</p>
        <p><span className="font-semibold">Expiry:</span> {i?.expiration_date}</p>
        <p><span className="font-semibold">Location:</span> {i?.storage_location}</p>
      </div>
    </div>
  );
}
