import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSms } from "@/lib/twilio";
import type { Quote } from "@/types";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ publicId: string }> },
) {
  const { publicId } = await params;
  const body = (await req.json()) as { action?: string };
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const admin = createAdminClient();
  const { data: quote, error } = await admin
    .from("quotes")
    .select("*")
    .eq("public_id", publicId)
    .single();

  if (error || !quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: businessRow } = await admin
    .from("businesses")
    .select("phone, notify_sms_on_approval, name")
    .eq("id", quote.business_id)
    .single();

  if (quote.status !== "sent") {
    return NextResponse.json(
      { error: "Quote is not awaiting approval" },
      { status: 400 },
    );
  }

  const action = body.action;
  if (action !== "approve" && action !== "decline") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const patch =
    action === "approve"
      ? { status: "approved" as const, approved_at: now }
      : { status: "declined" as const };

  const { data: updated, error: upErr } = await admin
    .from("quotes")
    .update(patch)
    .eq("id", quote.id)
    .select("*")
    .single();

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  if (action === "approve" && businessRow?.notify_sms_on_approval && businessRow.phone) {
    await sendSms(
      businessRow.phone,
      `Your quote #${quote.quote_number} was approved by the customer.`,
    );
  }

  return NextResponse.json({ ok: true, quote: updated as Quote });
}
