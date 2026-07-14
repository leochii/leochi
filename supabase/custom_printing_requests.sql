create extension if not exists pgcrypto;

create sequence if not exists public.custom_printing_quote_number_seq start 1;

create table if not exists public.custom_printing_requests (
  id uuid primary key default gen_random_uuid(),
  quote_sequence bigint unique default nextval('public.custom_printing_quote_number_seq'),
  status text not null default 'Quote Requested',
  name text not null,
  email text not null,
  company text,
  instagram_or_website text,
  quantity integer not null check (quantity >= 5),
  garment_type text not null,
  desired_delivery_date date,
  print_details text[] not null default '{}',
  notes text,
  file_url text not null,
  file_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.custom_printing_requests
  add column if not exists quote_sequence bigint,
  add column if not exists status text default 'Quote Requested',
  add column if not exists instagram_or_website text,
  add column if not exists desired_delivery_date date,
  add column if not exists print_details text[] default '{}',
  add column if not exists file_urls jsonb default '[]'::jsonb;

alter table public.custom_printing_requests
  alter column quote_sequence set default nextval('public.custom_printing_quote_number_seq'),
  alter column status set default 'Quote Requested',
  alter column print_details set default '{}',
  alter column file_urls set default '[]'::jsonb;

update public.custom_printing_requests
set quote_sequence = nextval('public.custom_printing_quote_number_seq')
where quote_sequence is null;

update public.custom_printing_requests
set status = 'Quote Requested'
where status is null;

update public.custom_printing_requests
set print_details = '{}'
where print_details is null;

update public.custom_printing_requests
set file_urls = jsonb_build_array(file_url)
where file_urls is null or file_urls = '[]'::jsonb;

alter table public.custom_printing_requests
  alter column quote_sequence set not null,
  alter column status set not null,
  alter column print_details set not null,
  alter column file_urls set not null;

create index if not exists custom_printing_requests_created_at_idx
  on public.custom_printing_requests (created_at desc);

create unique index if not exists custom_printing_requests_quote_sequence_idx
  on public.custom_printing_requests (quote_sequence);

alter table public.custom_printing_requests enable row level security;

insert into storage.buckets (id, name, public)
values ('custom-printing-designs', 'custom-printing-designs', true)
on conflict (id) do update set public = excluded.public;