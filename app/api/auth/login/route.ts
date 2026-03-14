import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = body.email as string | undefined;
  const password = body.password as string | undefined;

  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    return NextResponse.json({ error: error?.message ?? "invalid credentials" }, { status: 401 });
  }

  const { data: profile } = await createAdminClient()
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  const jsonResponse = NextResponse.json({ session: data.session, user: data.user, profile: profile ?? null });
  jsonResponse.cookies.set("app_access_token", data.session.access_token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: data.session.expires_in,
  });
  return jsonResponse;
}
