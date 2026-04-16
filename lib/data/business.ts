import { createClient } from "@/lib/supabase/server";
import type { Business } from "@/types";

export async function getBusinessForUser(): Promise<Business | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Business;
}
