"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, FileText, FlaskConical, LayoutDashboard, Package, ReceiptText, Settings, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/constants";

const links: Array<{ label: string; href: string; icon: LucideIcon; allow: Role[] }> = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, allow: ["superadmin", "admin", "pharmacist", "technician", "cashier", "readonly"] },
  { label: "Prescriptions", href: "/prescriptions", icon: ClipboardList, allow: ["superadmin", "admin", "pharmacist", "technician"] },
  { label: "Patients", href: "/patients", icon: Users, allow: ["superadmin", "admin", "pharmacist", "technician"] },
  { label: "Inventory", href: "/inventory", icon: Package, allow: ["superadmin", "admin", "pharmacist", "technician"] },
  { label: "POS", href: "/pos", icon: ReceiptText, allow: ["superadmin", "admin", "pharmacist", "technician", "cashier"] },
  { label: "Claims", href: "/claims", icon: FileText, allow: ["superadmin", "admin", "pharmacist", "technician"] },
  { label: "Reports", href: "/reports", icon: FlaskConical, allow: ["superadmin", "admin", "pharmacist", "readonly"] },
  { label: "Compliance", href: "/compliance", icon: ShieldCheck, allow: ["superadmin", "admin", "pharmacist"] },
  { label: "Settings", href: "/settings", icon: Settings, allow: ["superadmin", "admin"] },
];

export function Sidebar({
  role,
  className,
  onNavigate,
}: {
  role: Role;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const visibleLinks = links.filter((item) => item.allow.includes(role));

  return (
    <aside
      className={cn(
        "border-r border-white/10 bg-[linear-gradient(180deg,#0a2540_0%,#102f53_45%,#173f73_100%)] px-4 py-5 text-white shadow-[14px_0_34px_rgba(10,37,64,0.36)] transition-transform duration-300 ease-out",
        className,
      )}
    >
      <div className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-cyan-300">Pharmacy Platform</p>
        <p className="mt-1 text-sm font-semibold text-white">Medication Intelligence</p>
      </div>

      <nav className="space-y-1.5">
        {visibleLinks.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border border-cyan-300/40 bg-cyan-300/20 text-cyan-100 shadow-sm"
                  : "text-slate-200 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-cyan-300/40 bg-cyan-300/15 px-3 py-3 text-xs text-cyan-100">
        DEA + HIPAA checks active
      </div>
    </aside>
  );
}
