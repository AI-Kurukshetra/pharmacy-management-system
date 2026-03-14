"use client";

import { useState } from "react";
import type { Role } from "@/lib/constants";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { cn } from "@/lib/utils";

export function DashboardShell({
  role,
  name,
  children,
}: {
  role: Role;
  name?: string | null;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(120deg,#0a2540_0%,#1f3b86_46%,#635bff_100%)]" />
      <div className="pointer-events-none absolute left-0 right-0 top-44 h-20 -skew-y-2 bg-[#f6f9fc]" />

      <Sidebar
        role={role}
        onNavigate={() => setSidebarOpen(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 -translate-x-full lg:static lg:translate-x-0",
          sidebarOpen && "translate-x-0",
        )}
      />

      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="relative z-10 flex min-h-screen flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_-18%,rgba(99,102,241,0.18),transparent_42%),radial-gradient(circle_at_4%_114%,rgba(14,165,233,0.16),transparent_36%)]" />
        <TopNav role={role} name={name} onMenuToggle={() => setSidebarOpen((open) => !open)} />
        <main className="flex-1 p-4 sm:p-5 lg:p-7">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
