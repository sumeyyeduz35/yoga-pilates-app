create table public.user_preferences (
  user_id uuid primary key
    references public.profiles(id)
    on delete cascade,

  goal text not null
    check (
      goal in (
        'flexibility',
        'strength',
        'stress_relief',
        'posture',
        'general_fitness'
      )
    ),

  experience_level text not null
    check (
      experience_level in (
        'beginner',
        'intermediate',
        'advanced'
      )
    ),

  preferred_disciplines text[] not null
    default '{}',

  workout_duration integer not null
    check (
      workout_duration in (15, 30, 45, 60)
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint user_preferences_disciplines_not_empty
    check (cardinality(preferred_disciplines) > 0),

  constraint user_preferences_valid_disciplines
    check (
      preferred_disciplines <@ array[
        'yoga',
        'pilates',
        'reformer'
      ]::text[]
    )
);

alter table public.user_preferences
enable row level security;

create policy "Users can view own preferences"
on public.user_preferences
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own preferences"
on public.user_preferences
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own preferences"
on public.user_preferences
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own preferences"
on public.user_preferences
for delete
to authenticated
using ((select auth.uid()) = user_id);