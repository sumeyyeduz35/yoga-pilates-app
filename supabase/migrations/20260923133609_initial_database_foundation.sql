-- =========================================================
-- PROFILES
-- Application profile for each authenticated user
-- =========================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  avatar_url text,

  onboarding_completed boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- DISCIPLINES
-- Main exercise disciplines available in the application
-- Yoga, Pilates and Reformer
-- =========================================================

create table public.disciplines (
  id uuid primary key default gen_random_uuid(),

  name text not null unique,
  slug text not null unique,
  description text,

  is_active boolean not null default true,
  sort_order smallint not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint disciplines_sort_order_check
    check (sort_order >= 0)
);


-- =========================================================
-- UPDATED_AT AUTOMATION
-- Automatically refreshes updated_at when a row is modified
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_disciplines_updated_at
before update on public.disciplines
for each row
execute function public.set_updated_at();


-- =========================================================
-- PROFILES ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);


-- =========================================================
-- AUTH -> PROFILE AUTOMATION
-- Automatically creates a profile when a user signs up
-- =========================================================

create schema if not exists private;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    avatar_url
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;
end;
$$;

revoke execute
on function private.handle_new_user()
from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();


-- =========================================================
-- DISCIPLINES ROW LEVEL SECURITY
-- =========================================================

alter table public.disciplines enable row level security;

create policy "Anyone can read active disciplines"
on public.disciplines
for select
to anon, authenticated
using (is_active = true);


-- =========================================================
-- INITIAL DISCIPLINES
-- =========================================================

insert into public.disciplines (
  name,
  slug,
  sort_order
)
values
  ('Yoga', 'yoga', 1),
  ('Pilates', 'pilates', 2),
  ('Reformer', 'reformer', 3);


-- =========================================================
-- TABLE PRIVILEGES
-- Explicit least-privilege access for Data API roles
-- =========================================================

revoke all on table public.profiles from anon, authenticated;

grant select, update
on table public.profiles
to authenticated;

revoke all on table public.disciplines from anon, authenticated;

grant select
on table public.disciplines
to anon, authenticated;