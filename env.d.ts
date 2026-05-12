/** Supabase & app env vars (see `.env.example`). Loaded by Next.js from `.env*` at build/run time. */

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_SUPABASE_URL?: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
    readonly SUPABASE_URL?: string;
    readonly SUPABASE_ANON_KEY?: string;
    readonly SUPABASE_SERVICE_ROLE_KEY?: string;
    readonly NEXT_PUBLIC_APP_URL?: string;
  }
}
