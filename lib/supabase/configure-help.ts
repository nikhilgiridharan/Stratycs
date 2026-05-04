/** Env + redeploy reminder when the browser bundle has no embedded Supabase API URL/key. */
export const SUPABASE_CONFIGURE_HELP =
  "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from Supabase - Settings - API (needed at build time for the browser). Vercel: Project Settings - Environment Variables, redeploy. Local: .env.local, restart npm run dev. Optionally add SUPABASE_URL and SUPABASE_ANON_KEY with the same values for the server.";

/** Shown after Google OAuth bootstrap fails due to missing or placeholder Supabase secrets. */
export const SUPABASE_OAUTH_ROUTE_CONFIGURE_HELP =
  "Google sign-in is not configured yet. Add SUPABASE_URL and SUPABASE_ANON_KEY (recommended) or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY using the values from Supabase Dashboard - Settings - API. On Vercel: Project Settings - Environment Variables for all deployments, redeploy.";
