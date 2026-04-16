import { createBrowserClient } from "@supabase/ssr";

const placeholderUrl = "https://placeholder.supabase.co";
const placeholderKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? placeholderUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? placeholderKey,
  );
}
