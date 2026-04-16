import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/data/business";

export default async function NewQuotePage() {
  const business = await getBusinessForUser();
  if (!business) redirect("/onboarding");
  if (!business.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .insert({
      business_id: business.id,
      customer_name: "",
      status: "draft",
      tax_enabled: business.tax_enabled,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/dashboard");
  }

  redirect(`/quotes/${data.id}`);
}
