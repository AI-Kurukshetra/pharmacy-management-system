"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useNotifications(profileId?: string, onNotification?: () => void) {
  useEffect(() => {
    if (!profileId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${profileId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `profile_id=eq.${profileId}` },
        () => onNotification?.(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [profileId, onNotification]);
}
