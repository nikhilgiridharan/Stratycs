import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/data/business";
import { shouldShowPaywall } from "@/lib/subscription";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Quote } from "@/types";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const business = await getBusinessForUser();
  if (!business) redirect("/onboarding");
  if (!business.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();
  const { data: quotes } = await supabase
    .from("quotes")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const list = (quotes ?? []) as Quote[];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const sentThisMonth = list.filter(
    (q) =>
      q.status !== "draft" &&
      q.sent_at &&
      new Date(q.sent_at) >= monthStart,
  ).length;
  const approved = list.filter((q) => q.status === "approved").length;
  const revenue = list.reduce((s, q) => s + Number(q.total), 0);

  const paywall = shouldShowPaywall(business);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{business.name}</p>
        </div>
        <Link
          href="/quotes/new"
          className={cn(buttonVariants(), "inline-flex min-h-11 items-center justify-center px-4")}
        >
          New quote
        </Link>
      </div>

      {paywall ? (
        <Card className="border-primary/40 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Subscription required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Your trial has ended. Add a card to keep sending quotes. You can
              still view drafts.
            </p>
            <Link
              href="/settings"
              className={cn(
                buttonVariants(),
                "inline-flex min-h-11 items-center justify-center px-4",
              )}
            >
              Open billing
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Sent this month
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{sentThisMonth}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Approved (all time)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{approved}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Revenue quoted
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            ${revenue.toFixed(0)}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm text-foreground">Quotes</h2>
        {list.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No quotes yet.{" "}
              <Link href="/quotes/new" className="text-primary underline">
                Create one
              </Link>
              .
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {list.map((q) => (
              <Link
                key={q.id}
                href={`/quotes/${q.id}`}
                className="flex min-h-[52px] items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium text-foreground">
                    #{q.quote_number} · {q.customer_name || "Untitled"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${Number(q.total).toFixed(2)}
                  </p>
                </div>
                <Badge variant="secondary">{q.status}</Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
