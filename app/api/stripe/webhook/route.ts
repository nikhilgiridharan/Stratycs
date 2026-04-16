import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!secret || !sig) {
    return NextResponse.json({ error: "Missing webhook config" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const admin = createAdminClient();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id ?? session.client_reference_id;
      const customerId =
        typeof session.customer === "string" ? session.customer : null;
      const subId =
        typeof session.subscription === "string" ? session.subscription : null;
      if (userId && customerId) {
        await admin
          .from("businesses")
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subId,
            subscription_status: "trialing",
          })
          .eq("user_id", userId);
      }
    }

    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      const customerId =
        typeof sub.customer === "string" ? sub.customer : null;
      let status = "active";
      if (sub.status === "trialing") status = "trialing";
      else if (sub.status === "past_due") status = "past_due";
      else if (sub.status === "canceled" || sub.status === "unpaid") {
        status = "canceled";
      }
      if (customerId) {
        await admin
          .from("businesses")
          .update({
            stripe_subscription_id: sub.id,
            subscription_status: status,
          })
          .eq("stripe_customer_id", customerId);
      }
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
