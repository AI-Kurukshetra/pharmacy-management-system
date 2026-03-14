import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Role } from "@/lib/constants";

const PUBLIC_PATHS = ["/login", "/signup", "/reset-password", "/api", "/manifest.json", "/offline"];
const DEFAULT_REDIRECT = "/dashboard";

const ROUTE_ACCESS: Array<{ prefix: string; allow: Role[] }> = [
  { prefix: "/patients", allow: ["superadmin", "admin", "pharmacist", "technician"] },
  { prefix: "/prescriptions", allow: ["superadmin", "admin", "pharmacist", "technician"] },
  { prefix: "/inventory", allow: ["superadmin", "admin", "pharmacist", "technician"] },
  { prefix: "/claims", allow: ["superadmin", "admin", "pharmacist", "technician"] },
  { prefix: "/prior-authorizations", allow: ["superadmin", "admin", "pharmacist", "technician"] },
  { prefix: "/compliance", allow: ["superadmin", "admin", "pharmacist"] },
  { prefix: "/reports", allow: ["superadmin", "admin", "pharmacist", "readonly"] },
  { prefix: "/settings", allow: ["superadmin", "admin"] },
  { prefix: "/pos", allow: ["superadmin", "admin", "pharmacist", "technician", "cashier"] },
  { prefix: "/notifications", allow: ["superadmin", "admin", "pharmacist", "technician", "readonly", "cashier"] },
];

async function getRole(accessToken: string, userId: string): Promise<Role | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return (data?.role as Role | undefined) ?? null;
}

function getRule(pathname: string) {
  return ROUTE_ACCESS.find((rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`));
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path));
  const response = NextResponse.next({ request });
  const accessToken = request.cookies.get("app_access_token")?.value || null;
  let user: { id: string } | null = null;
  if (accessToken) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data } = await supabase.auth.getUser(accessToken);
    if (data.user) {
      user = { id: data.user.id };
    }
  }

  if (!isPublic && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!isPublic && user) {
    const role = accessToken ? await getRole(accessToken, user.id) : null;
    const rule = getRule(pathname);
    if (rule && role && !rule.allow.includes(role)) {
      const url = request.nextUrl.clone();
      url.pathname = DEFAULT_REDIRECT;
      url.searchParams.set("forbidden", "1");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
