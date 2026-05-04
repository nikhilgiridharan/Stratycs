import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseOAuthRouteCredentials } from "@/lib/supabase/oauth-route-credentials";

export async function createClient() {
  const cookieStore = await cookies();
  const creds = getSupabaseOAuthRouteCredentials();

  return createServerClient(
    creds?.url ?? "https://placeholder.supabase.co",
    creds?.anonKey ??
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* Server Component — cookies may be read-only */
          }
        },
      },
    },
  );
}
