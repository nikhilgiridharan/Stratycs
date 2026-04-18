"use client";

import Link from "next/link";
import type { Business } from "@/types";

export function TrialBanner({ business }: { business: Business }) {
  if (business.subscription_status !== "trialing" || !business.trial_ends_at) {
    return null;
  }
  const end = new Date(business.trial_ends_at).getTime();
  if (end <= Date.now()) return null;

  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.max(1, Math.ceil((end - Date.now()) / msPerDay));
  const dateStr = new Date(business.trial_ends_at).toLocaleDateString(
    undefined,
    { dateStyle: "medium" },
  );

  return (
    <div className="border-b border-border bg-[#3a2a1a] px-3 py-3 text-center text-sm text-[#e8e4dc]">
      <p className="leading-relaxed">
        You&apos;re on your free trial — {days} day{days === 1 ? "" : "s"}{" "}
        remaining. Add payment info to keep access after {dateStr}.{" "}
        <Link
          href="/settings"
          className="font-semibold text-[#4ce8b8] underline decoration-[#4ce8b8]/50 underline-offset-2"
        >
          Add payment method
        </Link>
      </p>
    </div>
  );
}
