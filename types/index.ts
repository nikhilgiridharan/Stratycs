export type QuoteStatus = "draft" | "sent" | "approved" | "declined";

export type LineItemCategory =
  | "Equipment"
  | "Labor"
  | "Refrigerant"
  | "Materials"
  | "Permits"
  | "Misc";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete";

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  owner_name: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  address: string | null;
  license_number: string | null;
  default_labor_rate: number;
  default_markup_percent: number;
  tax_rate_percent: number;
  tax_enabled: boolean;
  notify_sms_on_approval: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  onboarding_completed: boolean;
  deposit_percent: number;
  created_at: string;
}

export interface LineItem {
  id: string;
  business_id: string;
  category: LineItemCategory;
  name: string;
  unit: string;
  default_price: number;
  taxable: boolean;
  active: boolean;
  created_at: string;
}

export interface Quote {
  id: string;
  business_id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  status: QuoteStatus;
  subtotal: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  quote_number: number;
  public_id: string;
  pdf_url: string | null;
  tax_enabled: boolean;
  created_at: string;
  sent_at: string | null;
  approved_at: string | null;
  expires_at: string | null;
}

export interface QuoteLineItem {
  id: string;
  quote_id: string;
  line_item_id: string | null;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Payment {
  id: string;
  quote_id: string;
  stripe_payment_intent_id: string | null;
  amount: number;
  status: string;
  created_at: string;
}

export interface QuoteWithLineItems extends Quote {
  quote_line_items: QuoteLineItem[];
  businesses?: Pick<
    Business,
    | "name"
    | "phone"
    | "email"
    | "logo_url"
    | "address"
    | "license_number"
  >;
}
