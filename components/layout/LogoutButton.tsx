"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e2f0] bg-white px-3 py-2 text-xs font-medium text-[#425466] shadow-sm transition hover:border-[#b7c9dd] hover:text-[#0a2540]"
    >
      <LogOut className="h-3.5 w-3.5" />
      Logout
    </button>
  );
}
