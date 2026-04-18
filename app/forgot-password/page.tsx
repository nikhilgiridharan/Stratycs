"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/login`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Check your email for a reset link.");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 font-display text-3xl text-foreground">
        Reset password
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Enter your account email and we&apos;ll send you a link to choose a new
        password.
      </p>
      {sent ? (
        <p className="text-sm text-muted-foreground">
          If an account exists for that address, you&apos;ll receive an email
          shortly.
        </p>
      ) : (
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
          <Button type="submit" className="min-h-11 w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-8 text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          ← Back to log in
        </Link>
      </p>
    </div>
  );
}
