import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { QuotePdfDocument } from "@/components/quotes/QuotePdfDocument";
import { canSendQuotes } from "@/lib/subscription";
import { sendEmail } from "@/lib/resend";
import { sendSms } from "@/lib/twilio";
import type { Business, Quote, QuoteLineItem } from "@/types";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await req.json()) as {
    delivery?: "sms" | "email" | "both";
  };
  const delivery = body.delivery ?? "email";

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

  if (!canSendQuotes(b)) {
    return NextResponse.json(
      { error: "Subscription inactive. Open billing to continue." },
      { status: 402 },
    );
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

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const publicUrl = `${baseUrl}/quote/${q.public_id}`;

  let pdfUrl: string | null = null;
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminClient();
      const path = `${b.id}/${id}.pdf`;
      await admin.storage.from("quotes").upload(path, buf, {
        contentType: "application/pdf",
        upsert: true,
      });
      const { data: pub } = admin.storage.from("quotes").getPublicUrl(path);
      pdfUrl = pub.publicUrl;
    }
  } catch {
    pdfUrl = null;
  }

  const { error: upErr } = await supabase
    .from("quotes")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
      pdf_url: pdfUrl,
    })
    .eq("id", id);

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const msg = `${b.name} sent you a quote. View it here: ${publicUrl}`;

  if (delivery === "sms" || delivery === "both") {
    const phone = q.customer_phone;
    if (!phone) {
      return NextResponse.json(
        { error: "Customer phone required for SMS" },
        { status: 400 },
      );
    }
    await sendSms(phone, msg);
  }

  if (delivery === "email" || delivery === "both") {
    const email = q.customer_email;
    if (!email) {
      return NextResponse.json(
        { error: "Customer email required for email" },
        { status: 400 },
      );
    }
    await sendEmail({
      to: email,
      subject: `Quote #${q.quote_number} from ${b.name}`,
      html: `<p>${msg}</p>`,
    });
  }

  return NextResponse.json({ ok: true, publicUrl, pdfUrl });
}
