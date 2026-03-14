import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const refreshToken = body.refresh_token as string | undefined;

  if (!refreshToken) {
    return NextResponse.json({ error: "refresh_token is required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) {
    return NextResponse.json({ error: error?.message ?? "refresh failed" }, { status: 400 });
  }

  return NextResponse.json({ session: data.session });
}
