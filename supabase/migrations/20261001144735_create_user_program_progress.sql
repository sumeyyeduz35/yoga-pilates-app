-- =========================================================
-- Phase 7: User Program Progress
-- =========================================================

-- ---------------------------------------------------------
-- 1. User Programs
-- ---------------------------------------------------------

create table public.user_programs (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  program_id uuid not null
    references public.programs(id)
    on delete cascade,

  status text not null default 'in_progress'
    check (
      status in (
        'in_progress',
        'completed',
        'abandoned'
      )
    ),

  started_at timestamptz not null default now(),
  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, program_id)
);


-- ---------------------------------------------------------
-- 2. User Program Exercise Progress
-- ---------------------------------------------------------

create table public.user_program_exercise_progress (
  id uuid primary key default gen_random_uuid(),

  user_program_id uuid not null
    references public.user_programs(id)
    on delete cascade,

  program_exercise_id uuid not null
    references public.program_exercises(id)
    on delete cascade,

  is_completed boolean not null default false,

  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_program_id, program_exercise_id)
);


-- ---------------------------------------------------------
-- 3. Indexes
-- ---------------------------------------------------------

create index user_programs_user_id_idx
  on public.user_programs(user_id);

create index user_programs_program_id_idx
  on public.user_programs(program_id);

create index user_programs_status_idx
  on public.user_programs(status);

create index user_program_exercise_progress_user_program_id_idx
  on public.user_program_exercise_progress(user_program_id);

create index user_program_exercise_progress_program_exercise_id_idx
  on public.user_program_exercise_progress(program_exercise_id);


-- ---------------------------------------------------------
-- 4. Updated At Triggers
-- ---------------------------------------------------------

create trigger set_user_programs_updated_at
before update on public.user_programs
for each row
execute function public.set_updated_at();

create trigger set_user_program_exercise_progress_updated_at
before update on public.user_program_exercise_progress
for each row
execute function public.set_updated_at();


-- ---------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------

alter table public.user_programs
  enable row level security;

alter table public.user_program_exercise_progress
  enable row level security;


-- ---------------------------------------------------------
-- 6. User Programs Policies
-- ---------------------------------------------------------

create policy
  "Users can read own program progress"
on public.user_programs
for select
to authenticated
using (
  auth.uid() = user_id
);

create policy
  "Users can insert own program progress"
on public.user_programs
for insert
to authenticated
with check (
  auth.uid() = user_id
);

create policy
  "Users can update own program progress"
on public.user_programs
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

create policy
  "Users can delete own program progress"
on public.user_programs
for delete
to authenticated
using (
  auth.uid() = user_id
);


-- ---------------------------------------------------------
-- 7. Exercise Progress Policies
-- ---------------------------------------------------------

create policy
  "Users can read own exercise progress"
on public.user_program_exercise_progress
for select
to authenticated
using (
  exists (
    select 1
    from public.user_programs
    where user_programs.id =
      user_program_exercise_progress.user_program_id
      and user_programs.user_id = auth.uid()
  )
);

create policy
  "Users can insert own exercise progress"
on public.user_program_exercise_progress
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_programs
    where user_programs.id =
      user_program_exercise_progress.user_program_id
      and user_programs.user_id = auth.uid()
  )
);

create policy
  "Users can update own exercise progress"
on public.user_program_exercise_progress
for update
to authenticated
using (
  exists (
    select 1
    from public.user_programs
    where user_programs.id =
      user_program_exercise_progress.user_program_id
      and user_programs.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.user_programs
    where user_programs.id =
      user_program_exercise_progress.user_program_id
      and user_programs.user_id = auth.uid()
  )
);

create policy
  "Users can delete own exercise progress"
on public.user_program_exercise_progress
for delete
to authenticated
using (
  exists (
    select 1
    from public.user_programs
    where user_programs.id =
      user_program_exercise_progress.user_program_id
      and user_programs.user_id = auth.uid()
  )
);