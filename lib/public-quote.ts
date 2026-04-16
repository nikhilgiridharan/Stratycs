import { createAdminClient } from "@/lib/supabase/admin";
import type { Business, Quote, QuoteLineItem } from "@/types";

export async function loadPublicQuote(publicId: string): Promise<{
  quote: Quote;
  business: Business;
  lines: QuoteLineItem[];
} | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  try {
    const admin = createAdminClient();
    const { data: quote, error: qe } = await admin
      .from("quotes")
      .select("*")
      .eq("public_id", publicId)
      .single();
    if (qe || !quote) return null;

    const { data: business, error: be } = await admin
      .from("businesses")
      .select("*")
      .eq("id", quote.business_id)
      .single();
    if (be || !business) return null;

    const { data: lines } = await admin
      .from("quote_line_items")
      .select("*")
      .eq("quote_id", quote.id)
      .order("id");

    return {
      quote: quote as Quote,
      business: business as Business,
      lines: (lines ?? []) as QuoteLineItem[],
    };
  } catch {
    return null;
  }
}
