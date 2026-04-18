import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/data/business";
import { QuoteBuilder } from "@/components/quotes/QuoteBuilder";
import { QuoteDetailView } from "@/components/quotes/QuoteDetailView";
import { canSendQuotes } from "@/lib/subscription";
import type { LineItem, Quote, QuoteLineItem } from "@/types";

export default async function QuoteEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = await getBusinessForUser();
  if (!business) redirect("/onboarding");
  if (!business.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();

  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .eq("business_id", business.id)
    .single();

  if (error || !quote) notFound();

  const { data: lines } = await supabase
    .from("quote_line_items")
    .select("*")
    .eq("quote_id", id)
    .order("id");

  const q = quote as Quote;
  const canSend = canSendQuotes(business);

  if (q.status !== "draft") {
    return (
      <QuoteDetailView
        business={business}
        quote={q}
        lines={(lines ?? []) as QuoteLineItem[]}
        canSend={canSend}
      />
    );
  }

  const { data: catalog } = await supabase
    .from("line_items")
    .select("*")
    .eq("business_id", business.id)
    .order("category")
    .order("name");

  return (
    <QuoteBuilder
      business={business}
      quote={q}
      catalog={(catalog ?? []) as LineItem[]}
      initialLines={(lines ?? []) as QuoteLineItem[]}
      canSend={canSend}
    />
  );
}
