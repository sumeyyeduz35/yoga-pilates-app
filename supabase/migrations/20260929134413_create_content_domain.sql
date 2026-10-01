-- =========================================================
-- Phase 6: Content Domain
-- =========================================================


-- ---------------------------------------------------------
-- 1. Exercise Categories
-- ---------------------------------------------------------

create table public.exercise_categories (
  id uuid primary key default gen_random_uuid(),

  discipline_id uuid not null
    references public.disciplines(id)
    on delete cascade,

  name text not null,
  slug text not null,
  description text,

  sort_order integer not null default 0
    check (sort_order >= 0),

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (discipline_id, slug),

  -- Required by the composite foreign key used by exercises.
  -- Guarantees that an exercise category belongs to the same
  -- discipline as the exercise referencing it.
  unique (id, discipline_id)
);


-- ---------------------------------------------------------
-- 2. Exercises
-- ---------------------------------------------------------

create table public.exercises (
  id uuid primary key default gen_random_uuid(),

  discipline_id uuid not null
    references public.disciplines(id)
    on delete cascade,

  category_id uuid,

  name text not null,
  slug text not null,

  description text,
  instructions text,

  difficulty text not null default 'beginner'
    check (
      difficulty in (
        'beginner',
        'intermediate',
        'advanced'
      )
    ),

  duration_seconds integer
    check (
      duration_seconds is null
      or duration_seconds > 0
    ),

  image_url text,
  video_url text,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (discipline_id, slug),

  -- Enforces category/discipline consistency.
  foreign key (category_id, discipline_id)
    references public.exercise_categories(id, discipline_id)
);


-- ---------------------------------------------------------
-- 3. Programs
-- ---------------------------------------------------------

create table public.programs (
  id uuid primary key default gen_random_uuid(),

  discipline_id uuid not null
    references public.disciplines(id)
    on delete restrict,

  title text not null,
  slug text not null unique,

  description text,

  difficulty text not null default 'beginner'
    check (
      difficulty in (
        'beginner',
        'intermediate',
        'advanced'
      )
    ),

  duration_minutes integer
    check (
      duration_minutes is null
      or duration_minutes > 0
    ),

  cover_image_url text,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ---------------------------------------------------------
-- 4. Program Exercises
-- ---------------------------------------------------------

create table public.program_exercises (
  id uuid primary key default gen_random_uuid(),

  program_id uuid not null
    references public.programs(id)
    on delete cascade,

  exercise_id uuid not null
    references public.exercises(id)
    on delete restrict,

  sort_order integer not null
    check (sort_order >= 0),

  duration_seconds integer
    check (
      duration_seconds is null
      or duration_seconds > 0
    ),

  repetitions integer
    check (
      repetitions is null
      or repetitions > 0
    ),

  rest_seconds integer
    check (
      rest_seconds is null
      or rest_seconds >= 0
    ),

  created_at timestamptz not null default now(),

  unique (program_id, sort_order)
);


-- ---------------------------------------------------------
-- 5. Indexes
-- ---------------------------------------------------------

create index exercise_categories_discipline_id_idx
  on public.exercise_categories(discipline_id);

create index exercises_discipline_id_idx
  on public.exercises(discipline_id);

create index exercises_category_id_idx
  on public.exercises(category_id);

create index exercises_difficulty_idx
  on public.exercises(difficulty);

create index programs_discipline_id_idx
  on public.programs(discipline_id);

create index programs_difficulty_idx
  on public.programs(difficulty);

create index program_exercises_program_id_idx
  on public.program_exercises(program_id);

create index program_exercises_exercise_id_idx
  on public.program_exercises(exercise_id);


-- =========================================================
-- 6. Updated At Triggers
-- =========================================================

-- Reuse the existing updated_at trigger function created
-- during the project foundation phase.

create trigger set_exercise_categories_updated_at
before update on public.exercise_categories
for each row
execute function public.set_updated_at();

create trigger set_exercises_updated_at
before update on public.exercises
for each row
execute function public.set_updated_at();

create trigger set_programs_updated_at
before update on public.programs
for each row
execute function public.set_updated_at();


-- =========================================================
-- 7. Row Level Security
-- =========================================================

alter table public.exercise_categories
  enable row level security;

alter table public.exercises
  enable row level security;

alter table public.programs
  enable row level security;

alter table public.program_exercises
  enable row level security;


-- =========================================================
-- 8. Read Policies
-- =========================================================


-- ---------------------------------------------------------
-- Exercise Categories
-- ---------------------------------------------------------

-- Authenticated users may read active exercise categories.

create policy
  "Authenticated users can read active exercise categories"
on public.exercise_categories
for select
to authenticated
using (
  is_active = true
);


-- ---------------------------------------------------------
-- Exercises
-- ---------------------------------------------------------

-- Authenticated users may read active exercises.

create policy
  "Authenticated users can read active exercises"
on public.exercises
for select
to authenticated
using (
  is_active = true
);


-- ---------------------------------------------------------
-- Programs
-- ---------------------------------------------------------

-- Authenticated users may read active programs.

create policy
  "Authenticated users can read active programs"
on public.programs
for select
to authenticated
using (
  is_active = true
);


-- ---------------------------------------------------------
-- Program Exercises
-- ---------------------------------------------------------

-- Program exercises are readable only when both the
-- parent program and referenced exercise are active.

create policy
  "Authenticated users can read active program exercises"
on public.program_exercises
for select
to authenticated
using (
  exists (
    select 1
    from public.programs
    where programs.id = program_exercises.program_id
      and programs.is_active = true
  )
  and
  exists (
    select 1
    from public.exercises
    where exercises.id = program_exercises.exercise_id
      and exercises.is_active = true
  )
);