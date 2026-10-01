create or replace function public.enforce_program_exercise_discipline()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  program_discipline_id uuid;
  exercise_discipline_id uuid;
begin
  select discipline_id
  into program_discipline_id
  from public.programs
  where id = new.program_id;

  select discipline_id
  into exercise_discipline_id
  from public.exercises
  where id = new.exercise_id;

  if program_discipline_id is distinct from exercise_discipline_id then
    raise exception
      'Program and exercise must belong to the same discipline';
  end if;

  return new;
end;
$$;

create trigger enforce_program_exercise_discipline
before insert or update of program_id, exercise_id
on public.program_exercises
for each row
execute function public.enforce_program_exercise_discipline();