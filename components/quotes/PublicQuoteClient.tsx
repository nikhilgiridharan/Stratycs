"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Business, Quote, QuoteLineItem } from "@/types";
import { cn } from "@/lib/utils";

export function PublicQuoteClient(props: {
  initial: {
    quote: Quote;
    business: Business;
    lines: QuoteLineItem[];
  };
}) {
  const [quote, setQuote] = useState(props.initial.quote);
  const { business, lines } = props.initial;
  const [loading, setLoading] = useState(false);

  async function act(action: "approve" | "decline") {
    setLoading(true);
    const res = await fetch(`/api/public/quotes/${quote.public_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const j = (await res.json()) as { error?: string; quote?: Quote };
    setLoading(false);
    if (!res.ok) {
      toast.error(j.error ?? "Could not update");
      return;
    }
    if (j.quote) setQuote(j.quote);
    toast.success(action === "approve" ? "Quote approved" : "Quote declined");
  }

  const statusLabel =
    quote.status === "sent"
      ? "Pending approval"
      : quote.status === "approved"
        ? "Approved"
        : quote.status === "declined"
          ? "Declined"
          : quote.status;

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-lg space-y-6">
        <header className="flex flex-col gap-3 border-b border-border pb-6">
          {business.logo_url ? (
            <Image
              src={business.logo_url}
              alt=""
              width={160}
              height={48}
              unoptimized
              className="h-12 w-auto object-contain"
            />
          ) : null}
          <div>
            <h1 className="font-display text-2xl">{business.name}</h1>
            <p className="text-sm text-muted-foreground">
              {[business.phone, business.email].filter(Boolean).join(" · ")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Quote #{quote.quote_number}</Badge>
            <Badge>{statusLabel}</Badge>
          </div>
        </header>

        <section>
          <h2 className="mb-2 text-sm">Customer</h2>
          <p className="text-sm">{quote.customer_name || "—"}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm">Line items</h2>
          {lines.map((l) => (
            <div
              key={l.id}
              className="flex justify-between gap-3 rounded-lg border border-border bg-card px-3 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{l.name}</p>
                <p className="text-xs text-muted-foreground">
                  {l.quantity} × ${Number(l.unit_price).toFixed(2)}
                </p>
              </div>
              <p className="font-medium">${Number(l.total).toFixed(2)}</p>
            </div>
          ))}
        </section>

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
          <section>
            <h2 className="mb-2 text-sm">Notes</h2>
            <p className="text-sm text-muted-foreground">{quote.notes}</p>
          </section>
        ) : null}

        {quote.pdf_url ? (
          <a
            href={quote.pdf_url}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "inline-flex min-h-11 w-full items-center justify-center",
            )}
          >
            Download PDF
          </a>
        ) : null}

        {quote.status === "sent" ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="min-h-12 flex-1"
              disabled={loading}
              onClick={() => void act("approve")}
            >
              Approve quote
            </Button>
            <Button
              variant="outline"
              className="min-h-12 flex-1"
              disabled={loading}
              onClick={() => void act("decline")}
            >
              Decline
            </Button>
          </div>
        ) : null}

        <p className="text-center text-xs text-muted-foreground">
          {business.license_number
            ? `License ${business.license_number} · `
            : ""}
          Quote valid for 30 days.
        </p>
      </div>
    </div>
  );
}
