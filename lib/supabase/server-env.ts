import { getSupabaseOAuthRouteCredentials } from "@/lib/supabase/oauth-route-credentials";

/**
 * True when runtime env has real Supabase URL + anon key (SSR / Route Handlers / Server Actions).
 * Accepts `SUPABASE_URL` + `SUPABASE_ANON_KEY` or `NEXT_PUBLIC_*` (same rules as `/api/auth/google`).
 */
export function isSupabaseServerConfigured(): boolean {
  return getSupabaseOAuthRouteCredentials() !== null;
}
