import type { Business } from "@/types";

export function canSendQuotes(business: Business): boolean {
  const now = Date.now();
  if (business.subscription_status === "active") return true;
  if (
    business.subscription_status === "trialing" &&
    business.trial_ends_at
  ) {
    return new Date(business.trial_ends_at).getTime() > now;
  }
  return false;
}

export function shouldShowPaywall(business: Business): boolean {
  return !canSendQuotes(business);
}
