import { redirect } from "next/navigation";
import Link from "next/link";
import { getBusinessForUser } from "@/lib/data/business";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const business = await getBusinessForUser();
  if (!business) redirect("/onboarding");
  if (!business.onboarding_completed) redirect("/onboarding");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Business profile, tax, notifications, and billing.
        </p>
      </div>
      <SettingsForm business={business} />
      <p className="text-center text-xs text-muted-foreground">
        <Link href="/privacy" className="underline">
          Privacy
        </Link>
        {" · "}
        <Link href="/terms" className="underline">
          Terms
        </Link>
      </p>
    </div>
  );
}
