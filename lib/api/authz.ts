import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ApiRole =
  | "superadmin"
  | "admin"
  | "pharmacist"
  | "technician"
  | "cashier"
  | "readonly";

export type ApiActor = {
  id: string;
  role: ApiRole;
  pharmacy_id: string | null;
  email: string;
};

const DOMAIN_ROLES: Record<string, ApiRole[]> = {
  patients: ["superadmin", "admin", "pharmacist", "technician"],
  medications: ["superadmin", "admin", "pharmacist", "readonly"],
  prescriptions: ["superadmin", "admin", "pharmacist", "technician"],
  inventory: ["superadmin", "admin", "pharmacist", "technician"],
  suppliers: ["superadmin", "admin", "pharmacist", "technician"],
  "purchase-orders": ["superadmin", "admin", "pharmacist", "technician"],
  claims: ["superadmin", "admin", "pharmacist", "technician"],
  "prior-authorizations": ["superadmin", "admin", "pharmacist", "technician"],
  transactions: ["superadmin", "admin", "pharmacist", "technician", "cashier"],
  notifications: ["superadmin", "admin", "pharmacist", "technician", "readonly", "cashier"],
  clinical: ["superadmin", "admin", "pharmacist", "technician"],
  compliance: ["superadmin", "admin", "pharmacist"],
  reports: ["superadmin", "admin", "pharmacist", "readonly"],
  analytics: ["superadmin", "admin", "pharmacist", "readonly"],
  pharmacies: ["superadmin", "admin"],
  users: ["superadmin", "admin"],
};

export function hasDomainAccess(domain: string, method: string, role: ApiRole) {
  const allowedRoles = DOMAIN_ROLES[domain];
  if (!allowedRoles || !allowedRoles.includes(role)) return false;
  if (method === "DELETE" && !["superadmin", "admin"].includes(role)) return false;
  if (role === "readonly" && method !== "GET") return false;
  if (role === "cashier" && !["transactions", "notifications"].includes(domain)) return false;
  return true;
}

export async function getApiActor(request: NextRequest): Promise<ApiActor> {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    throw new Error("missing bearer token");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("invalid token");
  const userId = data.user.id;

  const { data: profile, error: profileErr } = await createAdminClient()
    .from("profiles")
    .select("id, role, pharmacy_id, email")
    .eq("id", userId)
    .single();
  if (profileErr || !profile) {
    throw new Error("profile not found");
  }

  return {
    id: profile.id as string,
    role: profile.role as ApiRole,
    pharmacy_id: (profile.pharmacy_id as string | null) ?? null,
    email: profile.email as string,
  };
}
