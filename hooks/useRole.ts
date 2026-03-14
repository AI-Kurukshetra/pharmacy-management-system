"use client";

import type { Role } from "@/lib/constants";

export function useRole(role: Role | null) {
  return {
    isAdmin: role === "admin" || role === "superadmin",
    isPharmacist: role === "pharmacist",
    canVerify: role === "pharmacist" || role === "admin" || role === "superadmin",
  };
}
