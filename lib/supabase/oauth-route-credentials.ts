import {
  SUPABASE_FALLBACK_ANON_KEY,
  SUPABASE_FALLBACK_URL,
} from "@/lib/supabase/defaults";

/**
 * Credentials for server-only OAuth bootstrap (reads at request time on Vercel).
 * Prefer SUPABASE_URL + SUPABASE_ANON_KEY so Google works without relying on client-inlined NEXT_PUBLIC_*.
 */
export function getSupabaseOAuthRouteCredentials(): {
  url: string;
  anonKey: string;
} | null {
  const urlRaw =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    "";
  const anonRaw =
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    "";

  if (
    !urlRaw ||
    !anonRaw ||
    urlRaw.includes("placeholder.supabase.co") ||
    urlRaw === SUPABASE_FALLBACK_URL ||
    anonRaw === SUPABASE_FALLBACK_ANON_KEY
  ) {
    return null;
  }

  return { url: urlRaw, anonKey: anonRaw };
}
