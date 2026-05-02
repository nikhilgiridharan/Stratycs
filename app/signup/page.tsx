"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createClient,
  formatSupabaseNetworkError,
  isSupabaseBrowserConfigured,
  SUPABASE_CONFIGURE_HELP,
} from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const authReady = isSupabaseBrowserConfigured();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authReady) {
      toast.error(SUPABASE_CONFIGURE_HELP);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });
      if (error) {
        toast.error(formatSupabaseNetworkError(error.message));
        return;
      }
      toast.success("Check your email to confirm, or continue to onboarding.");
      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(formatSupabaseNetworkError(msg));
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    if (!authReady) {
      toast.error(SUPABASE_CONFIGURE_HELP);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });
      if (error) toast.error(formatSupabaseNetworkError(error.message));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(formatSupabaseNetworkError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="mb-2 font-display text-3xl text-foreground">
          Create account
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Start your 14-day free trial.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="min-h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="min-h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="min-h-11 w-full"
            disabled={loading || !authReady}
          >
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 w-full"
          onClick={() => void signInWithGoogle()}
          disabled={loading || !authReady}
        >
          Continue with Google
        </Button>
        {!authReady ? (
          <p className="mt-2 text-center text-xs leading-snug text-muted-foreground">
            Sign up needs Supabase env vars on your host (
            <code className="rounded px-1 text-[11px]">NEXT_PUBLIC_*</code>).
            Redeploy after adding them on Vercel.
          </p>
        ) : null}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Home
          </Link>
        </p>
      </div>
    </div>
  );
}
