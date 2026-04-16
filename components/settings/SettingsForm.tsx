"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import type { Business } from "@/types";

export function SettingsForm({ business }: { business: Business }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(business.name);
  const [phone, setPhone] = useState(business.phone ?? "");
  const [email, setEmail] = useState(business.email ?? "");
  const [address, setAddress] = useState(business.address ?? "");
  const [license, setLicense] = useState(business.license_number ?? "");
  const [logoUrl, setLogoUrl] = useState(business.logo_url ?? "");
  const [labor, setLabor] = useState(String(business.default_labor_rate));
  const [markup, setMarkup] = useState(String(business.default_markup_percent));
  const [taxEnabled, setTaxEnabled] = useState(business.tax_enabled);
  const [taxRate, setTaxRate] = useState(String(business.tax_rate_percent));
  const [notifySms, setNotifySms] = useState(business.notify_sms_on_approval);
  const [depositPct, setDepositPct] = useState(String(business.deposit_percent));

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from("businesses")
      .update({
        name,
        phone,
        email,
        address,
        license_number: license,
        logo_url: logoUrl || null,
        default_labor_rate: Number(labor),
        default_markup_percent: Number(markup),
        tax_enabled: taxEnabled,
        tax_rate_percent: Number(taxRate),
        notify_sms_on_approval: notifySms,
        deposit_percent: Number(depositPct),
      })
      .eq("id", business.id);
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  async function openBilling() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const j = (await res.json()) as { url?: string; error?: string };
    setLoading(false);
    if (!res.ok || !j.url) {
      toast.error(j.error ?? "Billing unavailable");
      return;
    }
    window.location.href = j.url;
  }

  async function openPortal() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const j = (await res.json()) as { url?: string; error?: string };
    setLoading(false);
    if (!res.ok || !j.url) {
      toast.error(j.error ?? "Portal unavailable");
      return;
    }
    window.location.href = j.url;
  }

  return (
    <form onSubmit={saveProfile} className="space-y-8">
      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm">Business</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            className="min-h-11"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            className="min-h-11"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="min-h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            className="min-h-11"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="license">License #</Label>
          <Input
            id="license"
            className="min-h-11"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo">Logo URL</Label>
          <Input
            id="logo"
            type="url"
            className="min-h-11"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm">Defaults</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="labor">Labor $/hr</Label>
            <Input
              id="labor"
              type="number"
              className="min-h-11"
              value={labor}
              onChange={(e) => setLabor(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="markup">Markup %</Label>
            <Input
              id="markup"
              type="number"
              className="min-h-11"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm">Tax</h2>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm">Charge tax on quotes</span>
          <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
        </div>
        <div>
          <Label htmlFor="tax">Tax rate %</Label>
          <Input
            id="tax"
            type="number"
            className="min-h-11"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm">Deposits (optional)</h2>
        <div>
          <Label htmlFor="dep">Deposit % of total</Label>
          <Input
            id="dep"
            type="number"
            min={0}
            max={100}
            className="min-h-11"
            value={depositPct}
            onChange={(e) => setDepositPct(e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm">Notifications</h2>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm">SMS when a quote is approved</span>
          <Switch checked={notifySms} onCheckedChange={setNotifySms} />
        </div>
      </section>

      <Separator />

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Pro plan: $29/mo after your 14-day trial.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 flex-1"
            disabled={loading}
            onClick={() => void openBilling()}
          >
            Start / update subscription
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="min-h-11 flex-1"
            disabled={loading}
            onClick={() => void openPortal()}
          >
            Customer portal
          </Button>
        </div>
      </section>

      <Button type="submit" className="min-h-12 w-full" disabled={loading}>
        {loading ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
