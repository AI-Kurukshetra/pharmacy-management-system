"use client";

import { Bell, Menu, Search } from "lucide-react";
import type { Role } from "@/lib/constants";
import { LogoutButton } from "@/components/layout/LogoutButton";

export function TopNav({ role, name, onMenuToggle }: { role: Role; name?: string | null; onMenuToggle?: () => void }) {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-5 lg:px-7">
      <div className="glass-panel flex h-16 items-center justify-between rounded-2xl border border-white/60 px-4 shadow-[0_10px_26px_rgba(10,37,64,0.12)] sm:px-5">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuToggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d6e2f0] bg-white text-[#425466] shadow-sm lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4f46e5]">Operations Center</p>
          <p className="text-sm font-semibold text-[#0a2540]">Smart Pharmacy Management</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-full border border-[#d6e2f0] bg-white px-3.5 py-2 text-xs text-[#5b6b7f] shadow-sm xl:flex">
          <Search className="h-3.5 w-3.5" />
          Search patient / Rx / claim
        </label>
        <button className="rounded-xl border border-[#d6e2f0] bg-white p-2 text-[#5b6b7f] shadow-sm transition hover:border-[#b7c9dd] hover:text-[#0a2540]">
          <Bell className="h-4 w-4" />
        </button>
        <div className="rounded-full border border-[#d9e5ff] bg-gradient-to-r from-[#eef2ff] to-[#e0e7ff] px-3 py-1.5 text-[11px] font-semibold text-[#4338ca] shadow-sm">
          {role.toUpperCase()}
        </div>
        {name ? <div className="hidden text-xs text-[#5b6b7f] lg:block">{name}</div> : null}
        <LogoutButton />
      </div>
      </div>
    </header>
  );
}
