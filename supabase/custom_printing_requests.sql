create extension if not exists pgcrypto;

create table if not exists public.custom_printing_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  quantity integer not null check (quantity > 0),
  garment_type text not null,
  notes text,
  file_url text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists custom_printing_requests_created_at_idx
  on public.custom_printing_requests (created_at desc);

alter table public.custom_printing_requests enable row level security;

insert into storage.buckets (id, name, public)
values ('custom-printing-designs', 'custom-printing-designs', true)
on conflict (id) do update set public = excluded.public;