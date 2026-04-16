"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import type { LineItem } from "@/types";
import { cn } from "@/lib/utils";

export function PricebookTable(props: {
  businessId: string;
  items: LineItem[];
}) {
  const supabase = createClient();
  const [items, setItems] = useState(props.items);

  async function saveRow(item: LineItem, patch: Partial<LineItem>) {
    const { error } = await supabase
      .from("line_items")
      .update(patch)
      .eq("id", item.id)
      .eq("business_id", props.businessId);
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, ...patch } : i)),
    );
    toast.success("Saved");
  }

  const grouped = items.reduce<Record<string, LineItem[]>>((acc, item) => {
    const k = item.category;
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([cat, rows]) => (
        <section key={cat}>
          <h2 className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
            {cat}
          </h2>
          <div className="space-y-2">
            {rows.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border border-border bg-card p-4",
                  !item.active && "opacity-60",
                )}
              >
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Active</span>
                    <Switch
                      checked={item.active}
                      onCheckedChange={(v) =>
                        void saveRow(item, { active: v })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Price</label>
                    <Input
                      type="number"
                      className="min-h-11"
                      defaultValue={Number(item.default_price)}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (!Number.isNaN(v))
                          void saveRow(item, { default_price: v });
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Unit</label>
                    <Input
                      className="min-h-11"
                      defaultValue={item.unit}
                      onBlur={(e) =>
                        void saveRow(item, { unit: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11 w-full"
                      onClick={() =>
                        void saveRow(item, { taxable: !item.taxable })
                      }
                    >
                      Taxable: {item.taxable ? "Yes" : "No"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
