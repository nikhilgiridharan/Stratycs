"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";

const trialDays = 14;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [license, setLicense] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [labor, setLabor] = useState("95");
  const [markup, setMarkup] = useState("15");
  const [taxRate, setTaxRate] = useState("8.25");
  const [taxEnabled, setTaxEnabled] = useState(true);

  useEffect(() => {
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      if (user.email) setEmail(user.email);
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
      owner_name: ownerName.trim() || null,
      phone,
      email: email || user.email,
      address: address || null,
      license_number: license || null,
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
        tax_rate_percent: Number(taxRate),
        tax_enabled: taxEnabled,
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

  const progressPct = (step / 3) * 100;

  return (
    <div>
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs font-medium text-muted-foreground">
          <span>
            Step {step} of 3
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-[#e8873a] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <h1 className="mb-6 font-display text-2xl text-foreground">
        {step === 1 && "Business info"}
        {step === 2 && "Logo (optional)"}
        {step === 3 && "Pricing defaults"}
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
            <Label htmlFor="owner-name">Your name</Label>
            <Input
              id="owner-name"
              required
              className="min-h-11"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="biz-phone">Phone</Label>
            <Input
              id="biz-phone"
              type="tel"
              required
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
            <Label htmlFor="biz-address">Address (optional)</Label>
            <Input
              id="biz-address"
              className="min-h-11"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">License number (optional)</Label>
            <Input
              id="license"
              className="min-h-11"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
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
            variant="outline"
            className="min-h-[52px] w-full border-2 text-base"
            onClick={() => void saveStep2(true)}
            disabled={loading}
          >
            Skip for now
          </Button>
          <Button
            type="button"
            className="min-h-11 w-full"
            onClick={() => void saveStep2(false)}
            disabled={loading}
          >
            Save & continue
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
          <div className="space-y-2">
            <Label htmlFor="tax">Tax rate %</Label>
            <Input
              id="tax"
              type="number"
              min={0}
              step="0.01"
              required
              className="min-h-11"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
            />
          </div>
          <div className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
            <div>
              <p className="text-sm font-medium">Charge tax by default</p>
              <p className="text-xs text-muted-foreground">
                You can toggle per quote.
              </p>
            </div>
            <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
          </div>
          <Button type="submit" className="min-h-11 w-full" disabled={loading}>
            {loading ? "Finishing…" : "Finish setup"}
          </Button>
        </form>
      )}
    </div>
  );
}
