import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const password = body.password as string | undefined;
  const userId = body.user_id as string | undefined;

  if (!password || !userId) {
    return NextResponse.json({ error: "password and user_id are required" }, { status: 400 });
  }

  const { data, error } = await createAdminClient().auth.admin.updateUserById(userId, { password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, user: data.user });
}
