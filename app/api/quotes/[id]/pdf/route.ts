import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { QuotePdfDocument } from "@/components/quotes/QuotePdfDocument";
import type { Business, Quote, QuoteLineItem } from "@/types";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: quote, error: qErr } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (qErr || !quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  const { data: business, error: bErr } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", quote.business_id)
    .single();

  if (bErr || !business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const b = business as Business;
  if (b.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const q = quote as Quote;

  const { data: lines } = await supabase
    .from("quote_line_items")
    .select("*")
    .eq("quote_id", id)
    .order("id");

  const lineItems = (lines ?? []) as QuoteLineItem[];

  const pdfLines = lineItems.map((l) => ({
    name: l.name,
    quantity: Number(l.quantity),
    unit_price: Number(l.unit_price),
    total: Number(l.total),
  }));

  const buf = await renderToBuffer(
    React.createElement(QuotePdfDocument, {
      businessName: b.name,
      businessPhone: b.phone,
      businessEmail: b.email,
      licenseNumber: b.license_number,
      quoteNumber: q.quote_number,
      customerName: q.customer_name,
      customerPhone: q.customer_phone,
      customerEmail: q.customer_email,
      lines: pdfLines,
      subtotal: Number(q.subtotal),
      tax_amount: Number(q.tax_amount),
      total: Number(q.total),
      notes: q.notes,
      createdAt: new Date(q.created_at).toLocaleDateString(),
    }) as unknown as Parameters<typeof renderToBuffer>[0],
  );

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="quote-${q.quote_number}.pdf"`,
    },
  });
}
