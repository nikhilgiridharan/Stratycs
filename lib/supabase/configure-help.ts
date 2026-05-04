/** Env + redeploy reminder for NEXT_PUBLIC_* (shared by browser + server). */
export const SUPABASE_CONFIGURE_HELP =
  "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your host environment. On Vercel: Project Settings - Environment Variables, then redeploy so Next.js can embed them. Locally: create .env.local and restart npm run dev.";

/** Shown after Google OAuth bootstrap fails due to missing or placeholder Supabase secrets. */
export const SUPABASE_OAUTH_ROUTE_CONFIGURE_HELP =
  "Google sign-in is not configured yet. Add SUPABASE_URL and SUPABASE_ANON_KEY (recommended) or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY using the values from Supabase Dashboard - Settings - API. On Vercel: Project Settings - Environment Variables for all deployments, redeploy.";
