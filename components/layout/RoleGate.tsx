import type { ReactNode } from "react";
import type { Role } from "@/lib/constants";

export function RoleGate({
  role,
  allow,
  children,
}: {
  role: Role;
  allow: Role[];
  children: ReactNode;
}) {
  if (!allow.includes(role)) {
    return <div className="rounded border border-amber-300 bg-amber-50 p-4 text-sm">Access denied for role: {role}</div>;
  }

  return <>{children}</>;
}
