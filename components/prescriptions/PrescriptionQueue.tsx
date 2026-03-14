"use client";

import { useState } from "react";
import { usePrescriptionQueue } from "@/hooks/usePrescriptionQueue";
import { StatusBadge } from "@/components/prescriptions/StatusBadge";

type Row = {
  id: string;
  rx_number: string;
  status: "received" | "filling" | "verification" | "ready" | "dispensed" | "rejected";
  patients?: { first_name?: string; last_name?: string } | null;
  medications?: { name?: string } | null;
};

export function PrescriptionQueue({ pharmacyId = "default", rows = [] }: { pharmacyId?: string; rows?: Row[] }) {
  const [refreshCount, setRefreshCount] = useState(0);
  usePrescriptionQueue(pharmacyId, () => setRefreshCount((v) => v + 1));

  return (
    <div className="shell-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 sm:px-5">
        <p className="text-sm font-semibold text-slate-900">Realtime Queue</p>
        <p className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">updates: {refreshCount}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2.5 sm:px-5">Rx#</th>
              <th className="px-4 py-2.5 sm:px-5">Patient</th>
              <th className="px-4 py-2.5 sm:px-5">Medication</th>
              <th className="px-4 py-2.5 sm:px-5">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                <td className="px-4 py-3.5 font-semibold text-slate-900 sm:px-5">{item.rx_number}</td>
                <td className="px-4 py-3.5 sm:px-5">{item.patients?.first_name} {item.patients?.last_name}</td>
                <td className="px-4 py-3.5 text-slate-600 sm:px-5">{item.medications?.name}</td>
                <td className="px-4 py-3.5 sm:px-5"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
