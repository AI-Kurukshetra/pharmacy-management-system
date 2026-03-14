import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireCurrentProfile } from "@/lib/server/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireCurrentProfile();
  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.email;

  return <DashboardShell role={profile.role} name={displayName}>{children}</DashboardShell>;
}
