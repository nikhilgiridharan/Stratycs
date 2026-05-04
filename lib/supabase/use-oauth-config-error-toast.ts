"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { SUPABASE_OAUTH_ROUTE_CONFIGURE_HELP } from "@/lib/supabase/configure-help";

/**
 * Reads ?oauth_error=config (set by `/api/auth/google` when secrets are missing), shows a toast, then cleans the URL.
 */
export function useOauthConfigureErrorToast(pathname: "/login" | "/signup") {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("oauth_error") !== "config") return;

    toast.error(SUPABASE_OAUTH_ROUTE_CONFIGURE_HELP);

    if (pathname === "/login") {
      const qp = new URLSearchParams();
      const next = searchParams.get("next");
      if (next) qp.set("next", next);
      router.replace(qp.size ? `/login?${qp.toString()}` : "/login");
    } else {
      router.replace("/signup");
    }
  }, [pathname, router, searchParams]);
}
