import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_CONFIGURE_HELP } from "@/lib/supabase/configure-help";
import {
  SUPABASE_FALLBACK_ANON_KEY,
  SUPABASE_FALLBACK_URL,
} from "@/lib/supabase/defaults";


function envOrPlaceholder(
  raw: string | undefined,
  fallback: string,
): string {
  const t = raw?.trim();
  return t && t.length > 0 ? t : fallback;
}

/** URL/key fallbacks so the browser client never initializes with empty strings (avoids runtime errors during local dev). */
export const supabaseBrowserEnv = {
  url: envOrPlaceholder(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_FALLBACK_URL,
  ),
  anonKey: envOrPlaceholder(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_FALLBACK_ANON_KEY,
  ),
} as const;

/** Re-export for login/signup imports. */
export { SUPABASE_CONFIGURE_HELP };

/** False when env vars were missing or empty at build time, or still using placeholder host. */
export function isSupabaseBrowserConfigured(): boolean {
  const { url, anonKey } = supabaseBrowserEnv;
  if (!url || !anonKey) return false;
  if (url === SUPABASE_FALLBACK_URL || anonKey === SUPABASE_FALLBACK_ANON_KEY)
    return false;
  if (url.includes("placeholder.supabase.co")) return false;
  return true;
}

/** Maps generic browser fetch errors to a clearer toast (Safari: "Load failed"). */
export function formatSupabaseNetworkError(raw: string): string {
  const lower = raw.toLowerCase();
  if (
    lower.includes("load failed") ||
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("placeholder.supabase")
  ) {
    return SUPABASE_CONFIGURE_HELP;
  }
  return raw;
}

export function createClient() {
  return createBrowserClient(supabaseBrowserEnv.url, supabaseBrowserEnv.anonKey);
}
