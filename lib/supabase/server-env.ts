import {
  SUPABASE_FALLBACK_ANON_KEY,
  SUPABASE_FALLBACK_URL,
} from "@/lib/supabase/defaults";

/** True when runtime env has real Supabase URL + anon key (SSR / Route Handlers / Server Actions). */
export function isSupabaseServerConfigured(): boolean {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!rawUrl || !rawKey) return false;
  if (rawUrl === SUPABASE_FALLBACK_URL || rawKey === SUPABASE_FALLBACK_ANON_KEY) {
    return false;
  }
  if (rawUrl.includes("placeholder.supabase.co")) return false;
  return true;
}
