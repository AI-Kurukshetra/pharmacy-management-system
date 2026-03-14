"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function usePrescriptionQueue(pharmacyId?: string, onChange?: () => void) {
  useEffect(() => {
    if (!pharmacyId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`prescription_queue:${pharmacyId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prescriptions", filter: `pharmacy_id=eq.${pharmacyId}` },
        () => onChange?.(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [pharmacyId, onChange]);
}
