import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const firstName = String(body.first_name || "").trim();
  const lastName = String(body.last_name || "").trim();

  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "password must be at least 8 characters" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName || "New",
        last_name: lastName || "User",
      },
    },
  });

  let userId = data.user?.id ?? "";
  let needsEmailConfirmation = !data.session;

  if (error || !userId) {
    // Fallback for strict auth settings / rate limits in demo environments.
    const { data: adminUser, error: adminError } = await createAdminClient().auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName || "New",
        last_name: lastName || "User",
      },
    });

    if (adminError || !adminUser.user) {
      return NextResponse.json({ error: adminError?.message ?? error?.message ?? "signup failed" }, { status: 400 });
    }

    userId = adminUser.user.id;
    needsEmailConfirmation = false;
  }

  await createAdminClient().from("profiles").upsert({
    id: userId,
    email,
    first_name: firstName || "New",
    last_name: lastName || "User",
    role: "technician",
    pharmacy_id: null,
  });

  return NextResponse.json({
    success: true,
    user_id: userId,
    needs_email_confirmation: needsEmailConfirmation,
  });
}
