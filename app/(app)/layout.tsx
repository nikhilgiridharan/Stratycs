import { BottomNav } from "@/components/layout/BottomNav";
import { TrialBanner } from "@/components/trial/TrialBanner";
import { getBusinessForUser } from "@/lib/data/business";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const business = await getBusinessForUser();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {business ? <TrialBanner business={business} /> : null}
      <div className="mx-auto max-w-3xl px-4 pt-4 md:px-8 md:pt-8">{children}</div>
      <BottomNav />
    </div>
  );
}
