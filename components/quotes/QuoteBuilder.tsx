"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import {
  computeLineTotal,
  computeQuoteTotals,
} from "@/lib/quote-math";
import type { Business, LineItem, Quote, QuoteLineItem } from "@/types";
import { shouldShowPaywall } from "@/lib/subscription";
import type { LineItemCategory } from "@/types";
import { cn } from "@/lib/utils";

type BuilderRow = {
  tempId: string;
  line_item_id: string | null;
  name: string;
  quantity: number;
  unit_price: number;
};

const CATEGORIES: LineItemCategory[] = [
  "Equipment",
  "Labor",
  "Refrigerant",
  "Materials",
  "Permits",
  "Misc",
];

function newId() {
  return crypto.randomUUID();
}

export function QuoteBuilder(props: {
  business: Business;
  quote: Quote;
  catalog: LineItem[];
  initialLines: QuoteLineItem[];
  canSend?: boolean;
}) {
  const canSend = props.canSend ?? !shouldShowPaywall(props.business);
  const supabase = createClient();
  const [customerName, setCustomerName] = useState(props.quote.customer_name);
  const [customerPhone, setCustomerPhone] = useState(
    props.quote.customer_phone ?? "",
  );
  const [customerEmail, setCustomerEmail] = useState(
    props.quote.customer_email ?? "",
  );
  const [notes, setNotes] = useState(props.quote.notes ?? "");
  const [taxEnabled, setTaxEnabled] = useState(props.quote.tax_enabled);
  const [rows, setRows] = useState<BuilderRow[]>(() =>
    props.initialLines.length
      ? props.initialLines.map((l) => ({
          tempId: l.id,
          line_item_id: l.line_item_id,
          name: l.name,
          quantity: Number(l.quantity),
          unit_price: Number(l.unit_price),
        }))
      : [],
  );
  const [saving, setSaving] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [delivery, setDelivery] = useState<"sms" | "email" | "both">("email");
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  const taxRate = props.business.tax_rate_percent;

  const totals = useMemo(() => {
    return computeQuoteTotals(
      rows.map((r) => ({
        quantity: r.quantity,
        unit_price: r.unit_price,
      })),
      taxEnabled,
      taxRate,
    );
  }, [rows, taxEnabled, taxRate]);

  const grouped = useMemo(() => {
    const m = new Map<string, LineItem[]>();
    for (const c of CATEGORIES) m.set(c, []);
    for (const item of props.catalog) {
      if (!item.active) continue;
      m.get(item.category as LineItemCategory)?.push(item);
    }
    return m;
  }, [props.catalog]);

  function addFromCatalog(item: LineItem) {
    setRows((prev) => [
      ...prev,
      {
        tempId: newId(),
        line_item_id: item.id,
        name: item.name,
        quantity: 1,
        unit_price: Number(item.default_price),
      },
    ]);
  }

  function addCustomLine() {
    const price = Number(customPrice);
    if (!customName.trim() || Number.isNaN(price)) {
      toast.error("Enter a name and price for the custom line.");
      return;
    }
    setRows((prev) => [
      ...prev,
      {
        tempId: newId(),
        line_item_id: null,
        name: customName.trim(),
        quantity: 1,
        unit_price: price,
      },
    ]);
    setCustomName("");
    setCustomPrice("");
  }

  function updateRow(tempId: string, patch: Partial<BuilderRow>) {
    setRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, ...patch } : r)),
    );
  }

  function removeRow(tempId: string) {
    setRows((prev) => prev.filter((r) => r.tempId !== tempId));
  }

  async function persistQuote(status: Quote["status"]) {
    const { error: qErr } = await supabase
      .from("quotes")
      .update({
        customer_name: customerName,
        customer_phone: customerPhone || null,
        customer_email: customerEmail || null,
        notes: notes || null,
        tax_enabled: taxEnabled,
        subtotal: totals.subtotal,
        tax_amount: totals.tax_amount,
        total: totals.total,
        status,
      })
      .eq("id", props.quote.id);

    if (qErr) throw qErr;

    await supabase
      .from("quote_line_items")
      .delete()
      .eq("quote_id", props.quote.id);

    if (rows.length) {
      const insertRows = rows.map((r) => ({
        quote_id: props.quote.id,
        line_item_id: r.line_item_id,
        name: r.name,
        quantity: r.quantity,
        unit_price: r.unit_price,
        total: computeLineTotal(r.quantity, r.unit_price),
      }));
      const { error: lErr } = await supabase
        .from("quote_line_items")
        .insert(insertRows);
      if (lErr) throw lErr;
    }
  }

  async function saveDraft() {
    setSaving(true);
    try {
      await persistQuote("draft");
      toast.success("Draft saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    }
    setSaving(false);
  }

  async function confirmSend() {
    setSaving(true);
    try {
      await persistQuote("draft");
      const res = await fetch(`/api/quotes/${props.quote.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivery }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(j.error ?? "Send failed");
      toast.success("Quote sent");
      setSendOpen(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not send");
    }
    setSaving(false);
  }

  const previewMessage = useMemo(() => {
    const base =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://app.stratycs.com";
    const url = `${base}/q/${props.quote.public_id}`;
    return `${props.business.name} sent you a quote. View it here: ${url}`;
  }, [props.business.name, props.quote.public_id]);

  return (
    <div className="space-y-6 pb-28">
      <div>
        <h1 className="font-display text-2xl text-foreground">
          Quote #{props.quote.quote_number}
        </h1>
        <p className="text-sm text-muted-foreground">
          {props.quote.status === "draft" ? (
            <Badge variant="secondary">Draft</Badge>
          ) : (
            <Badge>{props.quote.status}</Badge>
          )}
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm text-foreground">Customer</h2>
        <div className="space-y-2">
          <Label htmlFor="cname">Name</Label>
          <Input
            id="cname"
            className="min-h-11"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cphone">Phone</Label>
          <Input
            id="cphone"
            type="tel"
            className="min-h-11"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cemail">Email</Label>
          <Input
            id="cemail"
            type="email"
            className="min-h-11"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm text-foreground">Line items</h2>
        <ScrollArea className="h-[min(420px,50vh)] rounded-xl border border-border bg-card">
          <div className="space-y-6 p-3">
            {CATEGORIES.map((cat) => {
              const items = grouped.get(cat) ?? [];
              if (!items.length) return null;
              return (
                <div key={cat}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {cat}
                  </p>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={cn(
                          "flex min-h-[44px] w-full items-center justify-between rounded-lg border border-border px-3 text-left text-sm hover:bg-muted/40",
                        )}
                        onClick={() => addFromCatalog(item)}
                      >
                        <span>{item.name}</span>
                        <span className="text-muted-foreground">
                          ${Number(item.default_price).toFixed(0)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="rounded-xl border border-border bg-card p-3">
          <p className="mb-2 text-sm font-medium">Custom line</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Description"
              className="min-h-11 flex-1"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <Input
              placeholder="Price"
              type="number"
              className="min-h-11 w-full sm:w-28"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
            />
            <Button
              type="button"
              className="min-h-11"
              variant="secondary"
              onClick={addCustomLine}
            >
              Add
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm">Selected</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Tap items above to add to the quote.
          </p>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div
                key={r.tempId}
                className="rounded-lg border border-border p-3"
              >
                <div className="mb-2 flex justify-between gap-2">
                  <span className="text-sm font-medium">{r.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-destructive"
                    onClick={() => removeRow(r.tempId)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Qty</Label>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 min-w-11 px-0"
                        onClick={() =>
                          updateRow(r.tempId, {
                            quantity: Math.max(0.25, r.quantity - 1),
                          })
                        }
                      >
                        −
                      </Button>
                      <Input
                        type="number"
                        className="min-h-11 text-center"
                        value={r.quantity}
                        onChange={(e) =>
                          updateRow(r.tempId, {
                            quantity: Number(e.target.value) || 0,
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 min-w-11 px-0"
                        onClick={() =>
                          updateRow(r.tempId, { quantity: r.quantity + 1 })
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Unit price</Label>
                    <Input
                      type="number"
                      className="min-h-11"
                      value={r.unit_price}
                      onChange={(e) =>
                        updateRow(r.tempId, {
                          unit_price: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <p className="mt-2 text-right text-sm text-muted-foreground">
                  Line: $
                  {computeLineTotal(r.quantity, r.unit_price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Tax</p>
            <p className="text-xs text-muted-foreground">
              Rate {taxRate}% (edit in settings)
            </p>
          </div>
          <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
        </div>
        <Separator />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${totals.tax_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </section>

      <div className="fixed bottom-20 left-0 right-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur md:static md:border-0 md:bg-transparent md:p-0">
        <div className="mx-auto flex max-w-3xl gap-3">
          <Button
            type="button"
            variant="secondary"
            className="min-h-12 flex-1"
            disabled={saving}
            onClick={() => void saveDraft()}
          >
            Save draft
          </Button>
          <Button
            type="button"
            className="min-h-12 flex-1"
            disabled={saving || !canSend}
            onClick={() => setSendOpen(true)}
            title={
              !canSend
                ? "Add a payment method to send quotes after your trial."
                : undefined
            }
          >
            Send quote
          </Button>
        </div>
      </div>

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">Choose delivery</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["email", "Email"],
                  ["sms", "SMS"],
                  ["both", "Both"],
                ] as const
              ).map(([v, label]) => (
                <Button
                  key={v}
                  type="button"
                  variant={delivery === v ? "default" : "outline"}
                  className="min-h-11"
                  onClick={() => setDelivery(v)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <Separator />
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Preview
            </p>
            <p className="rounded-md border border-border bg-muted/30 p-3 text-sm">
              {previewMessage}
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSendOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={saving}
              onClick={() => void confirmSend()}
            >
              Confirm & send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
