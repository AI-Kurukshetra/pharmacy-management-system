import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Role } from "@/lib/constants";

export type CurrentProfile = {
  id: string;
  email: string;
  role: Role;
  pharmacy_id: string | null;
  first_name: string | null;
  last_name: string | null;
};

function decodeJwtSubject(token: string): string | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as { sub?: string };
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export async function requireCurrentProfile(): Promise<CurrentProfile> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("app_access_token")?.value || null;
  let effectiveUserId: string | null = null;
  let currentUser: { email?: string | null; user_metadata?: Record<string, unknown> | null } | null = null;
  if (accessToken) {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const {
      data: { user },
    } = await supabase.auth.getUser(accessToken);
    effectiveUserId = user?.id ?? decodeJwtSubject(accessToken);
    currentUser = user
      ? {
          email: user.email,
          user_metadata: user.user_metadata as Record<string, unknown> | null,
        }
      : null;
  }

  if (!effectiveUserId) redirect("/login");

  const adminClient = createAdminClient();
  let { data: profile } = await adminClient
    .from("profiles")
    .select("id,email,role,pharmacy_id,first_name,last_name")
    .eq("id", effectiveUserId)
    .single();

  if (!profile && currentUser) {
    const firstName = String(currentUser.user_metadata?.first_name || "New");
    const lastName = String(currentUser.user_metadata?.last_name || "User");
    await adminClient.from("profiles").upsert({
      id: effectiveUserId,
      email: currentUser.email || "",
      first_name: firstName,
      last_name: lastName,
      role: "technician",
      pharmacy_id: null,
    });

    const { data: retriedProfile } = await adminClient
      .from("profiles")
      .select("id,email,role,pharmacy_id,first_name,last_name")
      .eq("id", effectiveUserId)
      .single();
    profile = retriedProfile;
  }

  if (!profile) redirect("/login");
  return profile as CurrentProfile;
}
