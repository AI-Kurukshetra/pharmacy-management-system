"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useInventoryAlerts(pharmacyId?: string, onAlert?: () => void) {
  useEffect(() => {
    if (!pharmacyId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`inventory_alerts:${pharmacyId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory_items", filter: `pharmacy_id=eq.${pharmacyId}` },
        () => onAlert?.(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [pharmacyId, onAlert]);
}
