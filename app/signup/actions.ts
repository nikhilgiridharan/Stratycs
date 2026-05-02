"use server";

import { headers } from "next/headers";
import { SUPABASE_CONFIGURE_HELP } from "@/lib/supabase/configure-help";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/server-env";

function requestOrigin(): string {
  try {
    const h = headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (!host) {
      return (
        process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
        "http://localhost:3000"
      );
    }
    const proto = h.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  } catch {
    return (
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
      "http://localhost:3000"
    );
  }
}

export type SignupWithEmailResult =
  | { ok: true; needsEmailConfirmation: boolean }
  | { ok: false; message: string };

/** Email/password signup on the server (same-origin): avoids flaky browser→Supabase requests (Safari “Load failed”). */
export async function signupWithEmail(
  email: string,
  password: string,
): Promise<SignupWithEmailResult> {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || password.length < 8) {
    return {
      ok: false,
      message: "Enter a valid email and a password with at least 8 characters.",
    };
  }

  if (!isSupabaseServerConfigured()) {
    return { ok: false, message: SUPABASE_CONFIGURE_HELP };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: `${requestOrigin()}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return {
      ok: true,
      needsEmailConfirmation: !data.session,
    };
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Could not sign up. Please try again.";
    return { ok: false, message: msg };
  }
}
