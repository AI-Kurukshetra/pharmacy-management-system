export function PaymentModal() {
  return (
    <div className="shell-card p-4 text-sm">
      <p className="font-semibold">Payment</p>
      <div className="mt-3 grid gap-2">
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-white">Pay by Card</button>
        <button className="rounded-lg border border-slate-300 bg-white px-3 py-2">Pay by Cash</button>
      </div>
    </div>
  );
}
