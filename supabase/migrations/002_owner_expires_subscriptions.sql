-- Add optional profile + quote expiry (run after 001)

alter table public.businesses
  add column if not exists owner_name text;

alter table public.quotes
  add column if not exists expires_at timestamptz;
