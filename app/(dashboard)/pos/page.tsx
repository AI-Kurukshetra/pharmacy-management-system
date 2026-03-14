import { CreditCard, HandCoins, ScanLine } from "lucide-react";

const cart = [
  ["RX-10346", "Lisinopril 10mg", 1, "$18.00"],
  ["OTC-114", "Vitamin D3", 1, "$12.00"],
  ["COPAY", "Insurance Copay", 1, "$15.00"],
] as const;

export default function Page() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
      <div className="shell-card p-5">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">POS Terminal</h1>
        <p className="mt-1 text-sm text-slate-600">Prescription + OTC checkout with copay handling</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900">Lookup by Rx# / Patient</button>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"><ScanLine className="h-4 w-4" /> Scan OTC Barcode</button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 sm:px-5">Code</th>
                  <th className="px-4 py-2.5 sm:px-5">Item</th>
                  <th className="px-4 py-2.5 sm:px-5">Qty</th>
                  <th className="px-4 py-2.5 sm:px-5">Amount</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((i) => (
                  <tr key={i[0]} className="border-t border-slate-100 hover:bg-slate-50/70">
                    <td className="px-4 py-3.5 font-semibold text-slate-900 sm:px-5">{i[0]}</td>
                    <td className="px-4 py-3.5 sm:px-5">{i[1]}</td>
                    <td className="px-4 py-3.5 sm:px-5">{i[2]}</td>
                    <td className="px-4 py-3.5 sm:px-5">{i[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="shell-card p-5">
          <p className="text-sm font-semibold text-slate-900">Payment</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">$45.00</p>
          <div className="mt-4 grid gap-2">
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"><CreditCard className="h-4 w-4" /> Card</button>
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"><HandCoins className="h-4 w-4" /> Cash</button>
          </div>
        </div>

        <div className="shell-card p-5 text-sm text-slate-700">Receipt preview and print controls appear here after payment confirmation.</div>
      </div>
    </div>
  );
}
