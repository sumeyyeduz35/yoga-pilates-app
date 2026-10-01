-- =========================================================
-- Phase 7: User Program Progress Permissions
-- =========================================================

grant select, insert, update, delete
on table public.user_programs
to authenticated;

grant select, insert, update, delete
on table public.user_program_exercise_progress
to authenticated;