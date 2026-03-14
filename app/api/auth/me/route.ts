import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    return NextResponse.json({ error: "missing bearer token" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: userError?.message ?? "invalid token" }, { status: 401 });
  }
  const userId = userData.user.id;

  const { data: profile } = await createAdminClient()
    .from("profiles")
    .select("*, pharmacies(*)")
    .eq("id", userId)
    .single();

  return NextResponse.json({ profile: profile ?? null, pharmacy: profile?.pharmacies ?? null });
}
