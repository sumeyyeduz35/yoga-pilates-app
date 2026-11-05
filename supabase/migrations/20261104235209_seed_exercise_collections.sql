
-- =========================================================
-- Exercise Collections - Initial Seed Data
-- =========================================================
-- 4 curated collections
-- 11 exercise associations
--
-- Collections remain inactive until the application
-- screens and content are ready.
--
-- Safe to run when the seed records already exist.
-- =========================================================

-- ---------------------------------------------------------
-- 1. Create Collections
-- ---------------------------------------------------------

insert into public.exercise_collections (
  title,
  slug,
  description,
  sort_order,
  is_active
)
values
  (
    'Sabah Enerjisi',
    'morning-energy',
    'Güne hafif hareketlerle başlamak için seçilmiş pratikler.',
    1,
    false
  ),
  (
    'Uyku Öncesi Rahatlama',
    'evening-relaxation',
    'Günün temposunu yavaşlatmaya yardımcı sakin pratikler.',
    2,
    false
  ),
  (
    'Masa Başı Molası',
    'desk-break',
    'Uzun süre oturduktan sonra hareket etmek için kısa pratikler.',
    3,
    false
  ),
  (
    'Yeni Başlayanlar',
    'beginner-essentials',
    'Temel hareketleri öğrenmek isteyenler için başlangıç pratikleri.',
    4,
    false
  )
on conflict (slug) do nothing;


-- ---------------------------------------------------------
-- 2. Associate Exercises With Collections
-- ---------------------------------------------------------
-- Exercises are matched using discipline and exercise slug.
-- UUID values are resolved automatically.
-- ---------------------------------------------------------

with collection_exercises (
  collection_slug,
  discipline_slug,
  exercise_slug,
  sort_order
) as (
  values

    -- Sabah Enerjisi
    (
      'morning-energy',
      'yoga',
      'cat-cow-stretch',
      1
    ),
    (
      'morning-energy',
      'yoga',
      'tree-pose',
      2
    ),
    (
      'morning-energy',
      'pilates',
      'spine-stretch-forward',
      3
    ),

    -- Uyku Öncesi Rahatlama
    (
      'evening-relaxation',
      'yoga',
      'child-pose',
      1
    ),
    (
      'evening-relaxation',
      'yoga',
      'cat-cow-stretch',
      2
    ),

    -- Masa Başı Molası
    (
      'desk-break',
      'pilates',
      'spine-stretch-forward',
      1
    ),
    (
      'desk-break',
      'yoga',
      'cat-cow-stretch',
      2
    ),

    -- Yeni Başlayanlar
    (
      'beginner-essentials',
      'yoga',
      'cat-cow-stretch',
      1
    ),
    (
      'beginner-essentials',
      'yoga',
      'child-pose',
      2
    ),
    (
      'beginner-essentials',
      'yoga',
      'tree-pose',
      3
    ),
    (
      'beginner-essentials',
      'pilates',
      'spine-stretch-forward',
      4
    )
)

insert into public.exercise_collection_items (
  collection_id,
  exercise_id,
  sort_order
)

select
  c.id,
  e.id,
  ce.sort_order

from collection_exercises ce

join public.exercise_collections c
  on c.slug = ce.collection_slug

join public.disciplines d
  on d.slug = ce.discipline_slug

join public.exercises e
  on e.slug = ce.exercise_slug
  and e.discipline_id = d.id

on conflict do nothing;


-- =========================================================
-- End of Initial Collection Seed
-- =========================================================
