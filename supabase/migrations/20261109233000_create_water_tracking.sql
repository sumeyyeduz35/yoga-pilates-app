
-- =========================================================
-- Tracking: Water Consumption
-- =========================================================

-- 1. Water Logs

create table public.water_logs (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  amount_ml integer not null
    check (amount_ml between 1 and 5000),

  consumed_on date not null,

  created_at timestamptz not null default now()
);

-- 2. Water Goals

create table public.water_goals (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  daily_goal_ml integer not null default 2000
    check (daily_goal_ml between 250 and 10000),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id)
);

-- 3. Indexes

create index water_logs_user_date_idx
  on public.water_logs(user_id, consumed_on);

-- 4. Updated At Trigger

create trigger set_water_goals_updated_at
before update on public.water_goals
for each row
execute function public.set_updated_at();

-- 5. Row Level Security

alter table public.water_logs
  enable row level security;

alter table public.water_goals
  enable row level security;

-- 6. Water Logs Policies

create policy "Users can read own water logs"
on public.water_logs
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own water logs"
on public.water_logs
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete own water logs"
on public.water_logs
for delete
to authenticated
using (auth.uid() = user_id);

-- 7. Water Goals Policies

create policy "Users can read own water goals"
on public.water_goals
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own water goals"
on public.water_goals
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own water goals"
on public.water_goals
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 8. Permissions

grant select, insert, delete
on public.water_logs
to authenticated;

grant select, insert, update
on public.water_goals
to authenticated;
