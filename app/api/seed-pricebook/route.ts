import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HVAC_SEED_ITEMS } from "@/lib/seed-hvac";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { businessId?: string };
  const businessId = body.businessId;
  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 });
  }

  const { data: biz, error: bizErr } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", businessId)
    .eq("user_id", user.id)
    .single();

  if (bizErr || !biz) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const { count, error: countErr } = await supabase
    .from("line_items")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  if (!countErr && count && count > 0) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const rows = HVAC_SEED_ITEMS.map((item) => ({
    business_id: businessId,
    category: item.category,
    name: item.name,
    unit: item.unit,
    default_price: item.default_price,
    taxable: item.taxable,
    active: true,
  }));

  const { error } = await supabase.from("line_items").insert(rows);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
