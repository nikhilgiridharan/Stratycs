import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/data/business";
import { canSendQuotes } from "@/lib/subscription";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Quote } from "@/types";
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

type SearchParams = { status?: string; q?: string };

export default async function QuotesHistoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const business = await getBusinessForUser();
  if (!business) redirect("/onboarding");
  if (!business.onboarding_completed) redirect("/onboarding");

  const allowNew = canSendQuotes(business);

  const supabase = await createClient();
  let qb = supabase
    .from("quotes")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const statusFilter = sp.status;
  if (
    statusFilter &&
    statusFilter !== "all" &&
    ["draft", "sent", "approved", "declined"].includes(statusFilter)
  ) {
    qb = qb.eq("status", statusFilter);
  }

  const { data: quotes } = await qb;
  let list = (quotes ?? []) as Quote[];
  const q = sp.q?.trim().toLowerCase();
  if (q) {
    list = list.filter((row) =>
      (row.customer_name || "").toLowerCase().includes(q),
    );
  }

  const filterLink = (status: string) => {
    const p = new URLSearchParams();
    if (status !== "all") p.set("status", status);
    if (sp.q) p.set("q", sp.q);
    const s = p.toString();
    return s ? `/quotes?${s}` : "/quotes";
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Quotes</h1>
          <p className="text-sm text-muted-foreground">
            All quotes, newest first.
          </p>
        </div>
        <Link
          href={allowNew ? "/quotes/new" : "/settings"}
          className={cn(
            buttonVariants(),
            "inline-flex min-h-11 items-center justify-center px-4",
          )}
        >
          {allowNew ? "New quote" : "Add payment"}
        </Link>
      </div>

      <form
        action="/quotes"
        method="get"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        {sp.status ? (
          <input type="hidden" name="status" value={sp.status} />
        ) : null}
        <Input
          name="q"
          placeholder="Search by customer name"
          defaultValue={sp.q ?? ""}
          className="min-h-11 max-w-md"
        />
        <button
          type="submit"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "min-h-11 px-4",
          )}
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["draft", "Draft"],
            ["sent", "Sent"],
            ["approved", "Approved"],
            ["declined", "Declined"],
          ] as const
        ).map(([value, label]) => {
          const active =
            (value === "all" && !statusFilter) ||
            (value !== "all" && statusFilter === value);
          return (
            <Link
              key={value}
              href={filterLink(value)}
              className={cn(
                "inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition-colors",
                active
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted/30",
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
          No quotes match.{" "}
          <Link href="/quotes/new" className="text-primary underline">
            Create one
          </Link>
          .
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((row) => (
            <Link
              key={row.id}
              href={`/quotes/${row.id}`}
              className="flex min-h-[52px] flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3 hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">
                  #{row.quote_number} · {row.customer_name || "Untitled"}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${Number(row.total).toFixed(2)}
                  {row.sent_at
                    ? ` · Sent ${new Date(row.sent_at).toLocaleDateString()}`
                    : null}
                </p>
              </div>
              <Badge className={cn("w-fit", statusBadgeClass(row.status))}>
                {row.status}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
