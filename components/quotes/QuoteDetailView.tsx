"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { computeLineTotal, computeQuoteTotals } from "@/lib/quote-math";
import type { Business, Quote, QuoteLineItem } from "@/types";
import { cn } from "@/lib/utils";

function statusBadgeClass(status: Quote["status"]) {
  switch (status) {
    case "draft":
      return "bg-muted text-muted-foreground";
    case "sent":
      return "bg-blue-500/20 text-blue-200";
    case "approved":
      return "bg-[#4ce8b8]/20 text-[#4ce8b8]";
    case "declined":
      return "bg-destructive/20 text-destructive";
    default:
      return "";
  }
}

export function QuoteDetailView(props: {
  business: Business;
  quote: Quote;
  lines: QuoteLineItem[];
  canSend: boolean;
}) {
  const { business, quote: initial, lines, canSend } = props;
  const router = useRouter();
  const supabase = createClient();
  const quote = initial;

  async function resend() {
    if (!canSend) {
      toast.error("Add a payment method to send quotes.");
      return;
    }
    const res = await fetch(`/api/quotes/${quote.id}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delivery: "both" }),
    });
    const j = (await res.json()) as { error?: string };
    if (!res.ok) {
      toast.error(j.error ?? "Could not resend");
      return;
    }
    toast.success("Quote sent again");
    router.refresh();
  }

  async function markApproved() {
    const { error } = await supabase
      .from("quotes")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", quote.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Marked as approved");
    router.refresh();
  }

  function downloadPdf() {
    window.open(`/api/quotes/${quote.id}/pdf`, "_blank");
  }

  async function duplicate() {
    const lineInputs = lines.map((l) => ({
      quantity: Number(l.quantity),
      unit_price: Number(l.unit_price),
    }));
    const totals = computeQuoteTotals(
      lineInputs,
      quote.tax_enabled,
      business.tax_rate_percent,
    );

    const { data: created, error: cErr } = await supabase
      .from("quotes")
      .insert({
        business_id: business.id,
        customer_name: quote.customer_name,
        customer_phone: quote.customer_phone,
        customer_email: quote.customer_email,
        status: "draft",
        subtotal: totals.subtotal,
        tax_amount: totals.tax_amount,
        total: totals.total,
        notes: quote.notes,
        tax_enabled: quote.tax_enabled,
      })
      .select("id")
      .single();

    if (cErr || !created) {
      toast.error(cErr?.message ?? "Could not duplicate");
      return;
    }

    if (lines.length) {
      const insertRows = lines.map((l) => ({
        quote_id: created.id,
        line_item_id: l.line_item_id,
        name: l.name,
        quantity: l.quantity,
        unit_price: l.unit_price,
        total: computeLineTotal(Number(l.quantity), Number(l.unit_price)),
      }));
      const { error: lErr } = await supabase
        .from("quote_line_items")
        .insert(insertRows);
      if (lErr) {
        toast.error(lErr.message);
        return;
      }
    }

    toast.success("Draft created");
    router.push(`/quotes/${created.id}`);
    router.refresh();
  }

  async function deleteDraft() {
    if (quote.status !== "draft") return;
    const { error } = await supabase.from("quotes").delete().eq("id", quote.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Quote deleted");
    router.push("/quotes");
    router.refresh();
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">
            Quote #{quote.quote_number}
          </h1>
          <Badge className={cn("mt-1", statusBadgeClass(quote.status))}>
            {quote.status}
          </Badge>
        </div>
        <Link
          href="/quotes"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex min-h-11 w-full items-center justify-center sm:w-auto",
          )}
        >
          Back to quotes
        </Link>
      </div>

      <section className="space-y-2 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-medium text-foreground">Customer</h2>
        <p className="text-foreground">{quote.customer_name || "—"}</p>
        <p className="text-sm text-muted-foreground">
          {[quote.customer_phone, quote.customer_email].filter(Boolean).join(" · ") ||
            "—"}
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-medium text-foreground">Line items</h2>
        <div className="space-y-3">
          {lines.map((l) => (
            <div
              key={l.id}
              className="flex flex-col gap-1 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between"
            >
              <span className="font-medium text-foreground">{l.name}</span>
              <span className="text-sm text-muted-foreground">
                {Number(l.quantity)} × ${Number(l.unit_price).toFixed(2)} = $
                {Number(l.total).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${Number(quote.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${Number(quote.tax_amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${Number(quote.total).toFixed(2)}</span>
          </div>
        </div>
        {quote.notes ? (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Notes</p>
              <p className="text-sm whitespace-pre-wrap">{quote.notes}</p>
            </div>
          </>
        ) : null}
      </section>

      <section className="space-y-1 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        <p>
          Created:{" "}
          {new Date(quote.created_at).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        {quote.sent_at ? (
          <p>
            Sent:{" "}
            {new Date(quote.sent_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        ) : null}
        {quote.approved_at ? (
          <p>
            Approved:{" "}
            {new Date(quote.approved_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        ) : null}
        {quote.expires_at ? (
          <p>
            Expires:{" "}
            {new Date(quote.expires_at).toLocaleDateString(undefined, {
              dateStyle: "medium",
            })}
          </p>
        ) : null}
      </section>

      <div className="flex flex-col gap-3">
        {quote.status === "sent" ? (
          <Button
            type="button"
            className="min-h-12 w-full bg-[#4ce8b8] text-[#1a1a1a] hover:bg-[#4ce8b8]/90"
            onClick={() => void resend()}
          >
            Resend
          </Button>
        ) : null}
        {quote.status === "sent" ? (
          <Button
            type="button"
            variant="secondary"
            className="min-h-12 w-full"
            onClick={() => void markApproved()}
          >
            Mark as approved
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="min-h-12 w-full"
          onClick={downloadPdf}
        >
          Download PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-12 w-full"
          onClick={() => void duplicate()}
        >
          Duplicate quote
        </Button>
        {quote.status === "draft" ? (
          <Button
            type="button"
            variant="destructive"
            className="min-h-12 w-full"
            onClick={() => void deleteDraft()}
          >
            Delete draft
          </Button>
        ) : null}
      </div>
    </div>
  );
}
