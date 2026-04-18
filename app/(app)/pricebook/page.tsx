import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/data/business";
import { PricebookTable } from "@/components/pricebook/PricebookTable";
import { canSendQuotes } from "@/lib/subscription";
import type { LineItem } from "@/types";

export default async function PricebookPage() {
  const business = await getBusinessForUser();
  if (!business) redirect("/onboarding");
  if (!business.onboarding_completed) redirect("/onboarding");
  if (!canSendQuotes(business)) redirect("/dashboard");

  const supabase = await createClient();
  const { data: items } = await supabase
    .from("line_items")
    .select("*")
    .eq("business_id", business.id)
    .order("category")
    .order("name");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl text-foreground">Price book</h1>
        <p className="text-sm text-muted-foreground">
          Edit defaults for your line items. Tap a row to update.
        </p>
      </div>
      <PricebookTable businessId={business.id} items={(items ?? []) as LineItem[]} />
    </div>
  );
}
