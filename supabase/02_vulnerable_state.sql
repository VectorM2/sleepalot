-- =====================================================================
-- SleepALot — VULNERABLE STATE  (run for the `sleepalot` app)
-- Run this SECOND, after 01_schema.sql, BEFORE seeding.
--
-- This puts the database into the intentionally-insecure state used for
-- testing. It is the "before" side of your remediation evidence.
--   * Row Level Security DISABLED on every table
--     => the public anon key can read/write ALL rows (broken access
--        control / IDOR at the data layer).
--   * A PUBLIC storage bucket for product images (misconfiguration).
-- =====================================================================

-- Make sure RLS is OFF (tables are created without it, but be explicit).
alter table public.profiles     disable row level security;
alter table public.products     disable row level security;
alter table public.reviews      disable row level security;
alter table public.orders       disable row level security;
alter table public.order_items  disable row level security;

-- Public storage bucket (anyone with the URL can list/download objects).
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Permissive storage policy: allow anyone to read objects in the bucket.
drop policy if exists "public read product-images" on storage.objects;
create policy "public read product-images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- NOTE: with table RLS disabled, no table policies are needed for the
-- anon key to reach every row. That is the point.
