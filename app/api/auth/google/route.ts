import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_CONFIGURE_HELP } from "@/lib/supabase/configure-help";
import { getSupabaseOAuthRouteCredentials } from "@/lib/supabase/oauth-route-credentials";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Server-backed Google OAuth so we read Supabase env at runtime (Vercel) instead of inlined client vars. */
export async function GET(request: NextRequest) {
  const creds = getSupabaseOAuthRouteCredentials();
  if (!creds) {
    return NextResponse.json(
      { error: SUPABASE_CONFIGURE_HELP },
      { status: 503 },
    );
  }

  const rawNext =
    request.nextUrl.searchParams.get("next")?.trim() || "/dashboard";
  const safeNext =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const merged = new Map<
    string,
    { name: string; value: string; options: Record<string, unknown> }
  >();

  const supabase = createServerClient(creds.url, creds.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          merged.set(name, { name, value, options: options ?? {} });
        }
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${request.nextUrl.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    return NextResponse.json(
      { error: error?.message ?? "Could not start Google sign-in" },
      { status: 400 },
    );
  }

  const redirectRes = NextResponse.redirect(data.url);
  for (const { name, value, options } of Array.from(merged.values())) {
    redirectRes.cookies.set(name, value, options);
  }
  return redirectRes;
}
