import { createBrowserClient } from "@supabase/ssr";

const placeholderUrl = "https://placeholder.supabase.co";
const placeholderKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder";

/** URL/key fallbacks so the browser client never initializes with empty strings (avoids runtime errors during local dev). */
export const supabaseBrowserEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? placeholderUrl,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? placeholderKey,
} as const;

export function createClient() {
  return createBrowserClient(supabaseBrowserEnv.url, supabaseBrowserEnv.anonKey);
}
