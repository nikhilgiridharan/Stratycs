"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const trialDays = 14;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [labor, setLabor] = useState("85");
  const [markup, setMarkup] = useState("15");

  useEffect(() => {
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data: biz } = await supabase
        .from("businesses")
        .select("id, onboarding_completed")
        .eq("user_id", user.id)
        .maybeSingle();
      if (biz?.onboarding_completed) {
        router.replace("/dashboard");
        return;
      }
      if (biz?.id) setBusinessId(biz.id);
    })();
  }, [router, supabase]);

  async function saveStep1(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + trialDays);

    const row = {
      user_id: user.id,
      name,
      phone,
      email,
      address,
      trial_ends_at: trialEnd.toISOString(),
      subscription_status: "trialing",
    };

    const { data, error } = await supabase
      .from("businesses")
      .upsert(row, { onConflict: "user_id" })
      .select("id")
      .single();

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data?.id) setBusinessId(data.id);
    setStep(2);
  }

  async function saveStep2(skip: boolean) {
    if (!businessId) {
      toast.error("Missing business");
      return;
    }
    setLoading(true);
    if (!skip && logoUrl) {
      const { error } = await supabase
        .from("businesses")
        .update({ logo_url: logoUrl })
        .eq("id", businessId);
      if (error) toast.error(error.message);
    }
    setLoading(false);
    setStep(3);
  }

  async function finish(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId) {
      toast.error("Missing business");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("businesses")
      .update({
        default_labor_rate: Number(labor),
        default_markup_percent: Number(markup),
        onboarding_completed: true,
      })
      .eq("id", businessId);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const seedRes = await fetch("/api/seed-pricebook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId }),
    });
    if (!seedRes.ok) {
      const j = (await seedRes.json().catch(() => ({}))) as { error?: string };
      toast.error(j.error ?? "Could not seed price book");
      setLoading(false);
      return;
    }

    toast.success("You're ready to quote.");
    router.push("/dashboard");
    router.refresh();
    setLoading(false);
  }

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Step {step} of 3
      </p>
      <h1 className="mb-6 font-display text-2xl text-foreground">
        {step === 1 && "Business info"}
        {step === 2 && "Logo (optional)"}
        {step === 3 && "Defaults"}
      </h1>

      {step === 1 && (
        <form onSubmit={saveStep1} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="biz-name">Business name</Label>
            <Input
              id="biz-name"
              required
              className="min-h-11"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="biz-phone">Phone</Label>
            <Input
              id="biz-phone"
              type="tel"
              className="min-h-11"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="biz-email">Email</Label>
            <Input
              id="biz-email"
              type="email"
              className="min-h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="biz-address">Address</Label>
            <Input
              id="biz-address"
              className="min-h-11"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <Button type="submit" className="min-h-11 w-full" disabled={loading}>
            Continue
          </Button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Paste a public URL to your logo, or skip for now.
          </p>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              type="url"
              placeholder="https://"
              className="min-h-11"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>
          <Button
            type="button"
            className="min-h-11 w-full"
            onClick={() => void saveStep2(false)}
            disabled={loading}
          >
            Save & continue
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="min-h-11 w-full"
            onClick={() => void saveStep2(true)}
            disabled={loading}
          >
            Skip
          </Button>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={finish} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="labor">Default labor rate ($/hr)</Label>
            <Input
              id="labor"
              type="number"
              min={0}
              step="0.01"
              required
              className="min-h-11"
              value={labor}
              onChange={(e) => setLabor(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="markup">Default markup %</Label>
            <Input
              id="markup"
              type="number"
              min={0}
              step="0.1"
              required
              className="min-h-11"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
            />
          </div>
          <Button type="submit" className="min-h-11 w-full" disabled={loading}>
            {loading ? "Finishing…" : "Finish setup"}
          </Button>
        </form>
      )}
    </div>
  );
}
