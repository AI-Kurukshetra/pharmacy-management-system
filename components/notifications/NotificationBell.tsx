"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationBell({ profileId = "default" }: { profileId?: string }) {
  const [count, setCount] = useState(3);
  useNotifications(profileId, () => setCount((v) => v + 1));

  return (
    <button className="relative rounded-xl border border-[#d6e2f0] bg-white p-2 text-[#5b6b7f] shadow-sm transition hover:border-[#b7c9dd] hover:text-[#0a2540]">
      <Bell className="h-4 w-4" />
      <span className="absolute -right-1 -top-1 rounded-full bg-[#635bff] px-1.5 text-[10px] text-white">{count}</span>
    </button>
  );
}
