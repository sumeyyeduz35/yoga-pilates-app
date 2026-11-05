
-- =========================================================
-- Activate Initial Exercise Collections
-- =========================================================
-- Activates only the four curated MVP collections.
-- Existing exercises, programs and users are unchanged.
-- =========================================================

update public.exercise_collections
set is_active = true
where slug in (
  'morning-energy',
  'evening-relaxation',
  'desk-break',
  'beginner-essentials'
)
and is_active = false;
