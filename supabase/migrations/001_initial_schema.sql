-- Stratycs schema + RLS (run in Supabase SQL editor or CLI)

-- Extensions
create extension if not exists "pgcrypto";

-- Users mirror (optional profile row)
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null default '',
  phone text,
  email text,
  logo_url text,
  address text,
  license_number text,
  default_labor_rate numeric not null default 85,
  default_markup_percent numeric not null default 15,
  tax_rate_percent numeric not null default 0,
  tax_enabled boolean not null default false,
  notify_sms_on_approval boolean not null default true,
  deposit_percent numeric not null default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text not null default 'trialing',
  trial_ends_at timestamptz,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.line_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  category text not null,
  name text not null,
  unit text not null default 'ea',
  default_price numeric not null default 0,
  taxable boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  customer_name text not null default '',
  customer_phone text,
  customer_email text,
  status text not null default 'draft',
  subtotal numeric not null default 0,
  tax_amount numeric not null default 0,
  total numeric not null default 0,
  notes text,
  quote_number integer not null default 1,
  public_id uuid not null default gen_random_uuid(),
  pdf_url text,
  tax_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  approved_at timestamptz,
  unique (business_id, quote_number)
);

create table if not exists public.quote_line_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes (id) on delete cascade,
  line_item_id uuid references public.line_items (id) on delete set null,
  name text not null,
  quantity numeric not null default 1,
  unit_price numeric not null default 0,
  total numeric not null default 0
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes (id) on delete cascade,
  stripe_payment_intent_id text,
  amount numeric not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_businesses_user on public.businesses (user_id);
create index if not exists idx_line_items_business on public.line_items (business_id);
create index if not exists idx_quotes_business on public.quotes (business_id);
create index if not exists idx_quotes_public on public.quotes (public_id);
create index if not exists idx_quote_line_quote on public.quote_line_items (quote_id);

-- RLS
alter table public.users enable row level security;
alter table public.businesses enable row level security;
alter table public.line_items enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_line_items enable row level security;
alter table public.payments enable row level security;

create policy "Users can view self"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update self"
  on public.users for update
  using (auth.uid() = id);

create policy "Business owner full access"
  on public.businesses for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Line items via business"
  on public.line_items for all
  using (
    exists (
      select 1 from public.businesses b
      where b.id = line_items.business_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = line_items.business_id and b.user_id = auth.uid()
    )
  );

create policy "Quotes via business"
  on public.quotes for all
  using (
    exists (
      select 1 from public.businesses b
      where b.id = quotes.business_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = quotes.business_id and b.user_id = auth.uid()
    )
  );

create policy "Quote line items via quote"
  on public.quote_line_items for all
  using (
    exists (
      select 1 from public.quotes q
      join public.businesses b on b.id = q.business_id
      where q.id = quote_line_items.quote_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.quotes q
      join public.businesses b on b.id = q.business_id
      where q.id = quote_line_items.quote_id and b.user_id = auth.uid()
    )
  );

create policy "Payments via quote"
  on public.payments for all
  using (
    exists (
      select 1 from public.quotes q
      join public.businesses b on b.id = q.business_id
      where q.id = payments.quote_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.quotes q
      join public.businesses b on b.id = q.business_id
      where q.id = payments.quote_id and b.user_id = auth.uid()
    )
  );

-- Trigger: create users row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Next quote number per business
create or replace function public.set_quote_number()
returns trigger
language plpgsql
as $$
declare
  next_no integer;
begin
  select coalesce(max(quote_number), 0) + 1 into next_no
  from public.quotes
  where business_id = new.business_id;
  new.quote_number := next_no;
  return new;
end;
$$;

drop trigger if exists trg_quote_number on public.quotes;
create trigger trg_quote_number
  before insert on public.quotes
  for each row execute function public.set_quote_number();
