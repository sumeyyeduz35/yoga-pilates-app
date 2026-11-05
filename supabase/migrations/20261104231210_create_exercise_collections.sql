
-- =========================================================
-- Exercise Collections
-- Curated, theme-based exercise collections
-- =========================================================

-- 1. Collections

create table public.exercise_collections (
  id uuid primary key default gen_random_uuid(),

  title text not null
    check (length(btrim(title)) > 0),

  slug text not null unique
    check (length(btrim(slug)) > 0),

  description text,
  cover_image_url text,

  sort_order integer not null default 0
    check (sort_order >= 0),

  is_active boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Collection items

create table public.exercise_collection_items (
  id uuid primary key default gen_random_uuid(),

  collection_id uuid not null
    references public.exercise_collections(id)
    on delete cascade,

  exercise_id uuid not null
    references public.exercises(id)
    on delete restrict,

  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default now(),

  unique (collection_id, exercise_id),
  unique (collection_id, sort_order)
);

-- 3. Indexes

create index exercise_collections_active_sort_idx
  on public.exercise_collections (
    sort_order,
    id
  )
  where is_active = true;

create index exercise_collection_items_collection_idx
  on public.exercise_collection_items (
    collection_id,
    sort_order
  );

create index exercise_collection_items_exercise_idx
  on public.exercise_collection_items (
    exercise_id
  );

-- 4. Updated-at trigger

create trigger set_exercise_collections_updated_at
before update on public.exercise_collections
for each row
execute function public.set_updated_at();

-- 5. Enable Row Level Security

alter table public.exercise_collections
  enable row level security;

alter table public.exercise_collection_items
  enable row level security;

-- 6. Collection read policy

create policy
  "Authenticated users can read active collections"
on public.exercise_collections
for select
to authenticated
using (
  is_active = true
);

-- 7. Collection item read policy

create policy
  "Authenticated users can read active collection items"
on public.exercise_collection_items
for select
to authenticated
using (
  exists (
    select 1
    from public.exercise_collections c
    where c.id = collection_id
      and c.is_active = true
  )
  and exists (
    select 1
    from public.exercises e
    where e.id = exercise_id
      and e.is_active = true
  )
);

-- 8. Permissions

grant select on table
  public.exercise_collections
to authenticated;

grant select on table
  public.exercise_collection_items
to authenticated;
