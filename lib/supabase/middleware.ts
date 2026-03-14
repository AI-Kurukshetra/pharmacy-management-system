import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAccessToken } from "@/lib/supabase/auth-cookie";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();
  if (data.user) {
    return { response: supabaseResponse, user: data.user };
  }

  const token = getSupabaseAccessToken(request.cookies.getAll());
  if (!token) {
    return { response: supabaseResponse, user: null };
  }

  const { data: fallbackData } = await supabase.auth.getUser(token);
  return { response: supabaseResponse, user: fallbackData.user ?? null };
}
