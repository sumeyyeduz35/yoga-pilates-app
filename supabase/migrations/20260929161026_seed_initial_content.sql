-- =========================================================
-- Development Seed Data
-- Yoga + Pilates + Reformer
-- =========================================================


-- ---------------------------------------------------------
-- Exercise Categories
-- ---------------------------------------------------------

-- Yoga

insert into public.exercise_categories (
  discipline_id,
  name,
  slug,
  description,
  sort_order
)
select
  id,
  'Flexibility',
  'flexibility',
  'Yoga practices focused on improving mobility and flexibility.',
  1
from public.disciplines
where slug = 'yoga';

insert into public.exercise_categories (
  discipline_id,
  name,
  slug,
  description,
  sort_order
)
select
  id,
  'Balance',
  'balance',
  'Yoga practices focused on balance, stability and body control.',
  2
from public.disciplines
where slug = 'yoga';

insert into public.exercise_categories (
  discipline_id,
  name,
  slug,
  description,
  sort_order
)
select
  id,
  'Relaxation',
  'relaxation',
  'Gentle yoga practices focused on relaxation and recovery.',
  3
from public.disciplines
where slug = 'yoga';


-- Pilates

insert into public.exercise_categories (
  discipline_id,
  name,
  slug,
  description,
  sort_order
)
select
  id,
  'Core',
  'core',
  'Pilates exercises focused on core strength and trunk stability.',
  1
from public.disciplines
where slug = 'pilates';

insert into public.exercise_categories (
  discipline_id,
  name,
  slug,
  description,
  sort_order
)
select
  id,
  'Mobility',
  'mobility',
  'Pilates exercises focused on controlled mobility and movement quality.',
  2
from public.disciplines
where slug = 'pilates';

insert into public.exercise_categories (
  discipline_id,
  name,
  slug,
  description,
  sort_order
)
select
  id,
  'Full Body',
  'full-body',
  'Pilates exercises involving multiple major muscle groups.',
  3
from public.disciplines
where slug = 'pilates';


-- Reformer

insert into public.exercise_categories (
  discipline_id,
  name,
  slug,
  description,
  sort_order
)
select
  id,
  'Core',
  'core',
  'Reformer exercises focused on core control and stability.',
  1
from public.disciplines
where slug = 'reformer';

insert into public.exercise_categories (
  discipline_id,
  name,
  slug,
  description,
  sort_order
)
select
  id,
  'Upper Body',
  'upper-body',
  'Reformer exercises focused on upper-body strength and control.',
  2
from public.disciplines
where slug = 'reformer';

insert into public.exercise_categories (
  discipline_id,
  name,
  slug,
  description,
  sort_order
)
select
  id,
  'Lower Body',
  'lower-body',
  'Reformer exercises focused on lower-body strength and control.',
  3
from public.disciplines
where slug = 'reformer';

-- ---------------------------------------------------------
-- Exercises
-- ---------------------------------------------------------

-- Yoga

insert into public.exercises (
  discipline_id, category_id, name, slug,
  description, instructions, difficulty, duration_seconds
)
select
  d.id, c.id,
  'Cat-Cow Stretch',
  'cat-cow-stretch',
  'A gentle spinal mobility exercise.',
  'Move slowly between spinal flexion and extension while coordinating the movement with your breath.',
  'beginner',
  60
from public.disciplines d
join public.exercise_categories c
  on c.discipline_id = d.id
where d.slug = 'yoga'
  and c.slug = 'flexibility';

insert into public.exercises (
  discipline_id, category_id, name, slug,
  description, instructions, difficulty, duration_seconds
)
select
  d.id, c.id,
  'Tree Pose',
  'tree-pose',
  'A standing yoga pose focused on balance and stability.',
  'Stand tall, place one foot against the opposite inner leg and maintain a steady upright position.',
  'beginner',
  45
from public.disciplines d
join public.exercise_categories c
  on c.discipline_id = d.id
where d.slug = 'yoga'
  and c.slug = 'balance';

insert into public.exercises (
  discipline_id, category_id, name, slug,
  description, instructions, difficulty, duration_seconds
)
select
  d.id, c.id,
  'Child Pose',
  'child-pose',
  'A gentle resting yoga pose for relaxation and recovery.',
  'Lower the hips toward the heels, extend the arms forward and relax into the position.',
  'beginner',
  90
from public.disciplines d
join public.exercise_categories c
  on c.discipline_id = d.id
where d.slug = 'yoga'
  and c.slug = 'relaxation';


-- Pilates

insert into public.exercises (
  discipline_id, category_id, name, slug,
  description, instructions, difficulty, duration_seconds
)
select
  d.id, c.id,
  'The Hundred',
  'the-hundred',
  'A classic Pilates exercise focused on core control.',
  'Maintain abdominal engagement while performing controlled arm pulses and steady breathing.',
  'intermediate',
  60
from public.disciplines d
join public.exercise_categories c
  on c.discipline_id = d.id
where d.slug = 'pilates'
  and c.slug = 'core';

insert into public.exercises (
  discipline_id, category_id, name, slug,
  description, instructions, difficulty, duration_seconds
)
select
  d.id, c.id,
  'Spine Stretch Forward',
  'spine-stretch-forward',
  'A controlled Pilates movement for spinal mobility.',
  'Sit tall with the legs extended and articulate the spine forward with controlled movement.',
  'beginner',
  60
from public.disciplines d
join public.exercise_categories c
  on c.discipline_id = d.id
where d.slug = 'pilates'
  and c.slug = 'mobility';

insert into public.exercises (
  discipline_id, category_id, name, slug,
  description, instructions, difficulty, duration_seconds
)
select
  d.id, c.id,
  'Swimming',
  'swimming',
  'A Pilates exercise involving the posterior chain and trunk.',
  'Lie prone and alternately lift opposite arms and legs while maintaining trunk control.',
  'intermediate',
  60
from public.disciplines d
join public.exercise_categories c
  on c.discipline_id = d.id
where d.slug = 'pilates'
  and c.slug = 'full-body';


-- Reformer

insert into public.exercises (
  discipline_id, category_id, name, slug,
  description, instructions, difficulty, duration_seconds
)
select
  d.id, c.id,
  'Reformer Knee Stretch',
  'reformer-knee-stretch',
  'A Reformer exercise focused on core stability and carriage control.',
  'Maintain a stable trunk while moving the carriage through a controlled range.',
  'intermediate',
  60
from public.disciplines d
join public.exercise_categories c
  on c.discipline_id = d.id
where d.slug = 'reformer'
  and c.slug = 'core';

insert into public.exercises (
  discipline_id, category_id, name, slug,
  description, instructions, difficulty, duration_seconds
)
select
  d.id, c.id,
  'Reformer Arm Pull',
  'reformer-arm-pull',
  'A Reformer movement focused on controlled upper-body strength.',
  'Maintain posture and shoulder control while pulling against the resistance of the straps.',
  'beginner',
  60
from public.disciplines d
join public.exercise_categories c
  on c.discipline_id = d.id
where d.slug = 'reformer'
  and c.slug = 'upper-body';

insert into public.exercises (
  discipline_id, category_id, name, slug,
  description, instructions, difficulty, duration_seconds
)
select
  d.id, c.id,
  'Reformer Footwork',
  'reformer-footwork',
  'A foundational Reformer exercise for controlled lower-body work.',
  'Press the carriage away with controlled leg extension and return without losing alignment.',
  'beginner',
  90
from public.disciplines d
join public.exercise_categories c
  on c.discipline_id = d.id
where d.slug = 'reformer'
  and c.slug = 'lower-body';

-- ---------------------------------------------------------
-- Programs
-- ---------------------------------------------------------

insert into public.programs (
  discipline_id,
  title,
  slug,
  description,
  difficulty,
  duration_minutes
)
select
  id,
  'Yoga Foundations',
  'yoga-foundations',
  'A beginner-friendly introduction to foundational yoga movements.',
  'beginner',
  15
from public.disciplines
where slug = 'yoga';

insert into public.programs (
  discipline_id,
  title,
  slug,
  description,
  difficulty,
  duration_minutes
)
select
  id,
  'Pilates Core Foundations',
  'pilates-core-foundations',
  'A foundational Pilates session focused on core control and mobility.',
  'beginner',
  15
from public.disciplines
where slug = 'pilates';

insert into public.programs (
  discipline_id,
  title,
  slug,
  description,
  difficulty,
  duration_minutes
)
select
  id,
  'Reformer Foundations',
  'reformer-foundations',
  'A foundational Reformer session introducing controlled full-body movement.',
  'beginner',
  15
from public.disciplines
where slug = 'reformer';


-- ---------------------------------------------------------
-- Program Exercises
-- ---------------------------------------------------------

-- Yoga Foundations

insert into public.program_exercises (
  program_id,
  exercise_id,
  sort_order,
  duration_seconds,
  rest_seconds
)
select
  p.id,
  e.id,
  1,
  60,
  15
from public.programs p
join public.exercises e
  on e.discipline_id = p.discipline_id
where p.slug = 'yoga-foundations'
  and e.slug = 'cat-cow-stretch';

insert into public.program_exercises (
  program_id,
  exercise_id,
  sort_order,
  duration_seconds,
  rest_seconds
)
select
  p.id,
  e.id,
  2,
  45,
  15
from public.programs p
join public.exercises e
  on e.discipline_id = p.discipline_id
where p.slug = 'yoga-foundations'
  and e.slug = 'tree-pose';

insert into public.program_exercises (
  program_id,
  exercise_id,
  sort_order,
  duration_seconds,
  rest_seconds
)
select
  p.id,
  e.id,
  3,
  90,
  0
from public.programs p
join public.exercises e
  on e.discipline_id = p.discipline_id
where p.slug = 'yoga-foundations'
  and e.slug = 'child-pose';


-- Pilates Core Foundations

insert into public.program_exercises (
  program_id,
  exercise_id,
  sort_order,
  duration_seconds,
  rest_seconds
)
select
  p.id,
  e.id,
  1,
  60,
  15
from public.programs p
join public.exercises e
  on e.discipline_id = p.discipline_id
where p.slug = 'pilates-core-foundations'
  and e.slug = 'the-hundred';

insert into public.program_exercises (
  program_id,
  exercise_id,
  sort_order,
  duration_seconds,
  rest_seconds
)
select
  p.id,
  e.id,
  2,
  60,
  15
from public.programs p
join public.exercises e
  on e.discipline_id = p.discipline_id
where p.slug = 'pilates-core-foundations'
  and e.slug = 'spine-stretch-forward';

insert into public.program_exercises (
  program_id,
  exercise_id,
  sort_order,
  duration_seconds,
  rest_seconds
)
select
  p.id,
  e.id,
  3,
  60,
  0
from public.programs p
join public.exercises e
  on e.discipline_id = p.discipline_id
where p.slug = 'pilates-core-foundations'
  and e.slug = 'swimming';


-- Reformer Foundations

insert into public.program_exercises (
  program_id,
  exercise_id,
  sort_order,
  duration_seconds,
  rest_seconds
)
select
  p.id,
  e.id,
  1,
  90,
  15
from public.programs p
join public.exercises e
  on e.discipline_id = p.discipline_id
where p.slug = 'reformer-foundations'
  and e.slug = 'reformer-footwork';

insert into public.program_exercises (
  program_id,
  exercise_id,
  sort_order,
  duration_seconds,
  rest_seconds
)
select
  p.id,
  e.id,
  2,
  60,
  15
from public.programs p
join public.exercises e
  on e.discipline_id = p.discipline_id
where p.slug = 'reformer-foundations'
  and e.slug = 'reformer-knee-stretch';

insert into public.program_exercises (
  program_id,
  exercise_id,
  sort_order,
  duration_seconds,
  rest_seconds
)
select
  p.id,
  e.id,
  3,
  60,
  0
from public.programs p
join public.exercises e
  on e.discipline_id = p.discipline_id
where p.slug = 'reformer-foundations'
  and e.slug = 'reformer-arm-pull';