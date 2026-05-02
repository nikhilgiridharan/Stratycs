import { createBrowserClient } from "@supabase/ssr";

const placeholderUrl = "https://placeholder.supabase.co";
const placeholderKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder";

function envOrPlaceholder(
  raw: string | undefined,
  fallback: string,
): string {
  const t = raw?.trim();
  return t && t.length > 0 ? t : fallback;
}

/** URL/key fallbacks so the browser client never initializes with empty strings (avoids runtime errors during local dev). */
export const supabaseBrowserEnv = {
  url: envOrPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL, placeholderUrl),
  anonKey: envOrPlaceholder(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    placeholderKey,
  ),
} as const;

/** Shown when OAuth / auth would hit placeholder.supabase.co or empty env. */
export const SUPABASE_CONFIGURE_HELP =
  "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your host’s environment. On Vercel: Project → Settings → Environment Variables, then Redeploy (required so Next.js can embed them). Locally: use .env.local and restart `npm run dev`.";

/** False when env vars were missing or empty at build time, or still using placeholder host. */
export function isSupabaseBrowserConfigured(): boolean {
  const { url, anonKey } = supabaseBrowserEnv;
  if (!url || !anonKey) return false;
  if (url === placeholderUrl || anonKey === placeholderKey) return false;
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
