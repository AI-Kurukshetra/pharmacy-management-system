export function PurchaseOrderForm() {
  return (
    <form className="shell-card grid gap-3 p-4 md:grid-cols-2 text-sm">
      <select className="rounded-lg border border-slate-300 px-3 py-2"><option>Cardinal</option><option>McKesson</option></select>
      <input type="date" className="rounded-lg border border-slate-300 px-3 py-2" />
      <textarea className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2" rows={4} placeholder="NDC, quantity, cost" />
      <button className="rounded-lg bg-slate-900 px-3 py-2 text-white md:col-span-2">Create PO</button>
    </form>
  );
}
