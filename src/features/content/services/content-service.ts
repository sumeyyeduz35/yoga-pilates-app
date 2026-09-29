import { supabase } from '@/lib/supabase';

import type {
    Difficulty,
    Discipline,
    DisciplineSlug,
    Exercise,
    ExerciseCategory,
    Program,
    ProgramExerciseWithExercise,
    ProgramWithExercises,
} from '../types/content';

type DisciplineRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

type ExerciseCategoryRow = {
  id: string;
  discipline_id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

type ExerciseRow = {
  id: string;
  discipline_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  instructions: string | null;
  difficulty: string;
  duration_seconds: number | null;
  image_url: string | null;
  video_url: string | null;
  is_active: boolean;
};

type ProgramRow = {
  id: string;
  discipline_id: string;
  title: string;
  slug: string;
  description: string | null;
  difficulty: string;
  duration_minutes: number | null;
  cover_image_url: string | null;
  is_active: boolean;
};

type ProgramExerciseRow = {
  id: string;
  program_id: string;
  exercise_id: string;
  sort_order: number;
  duration_seconds: number | null;
  repetitions: number | null;
  rest_seconds: number | null;
  exercise: ExerciseRow | ExerciseRow[];
};

function isDifficulty(value: string): value is Difficulty {
  return ['beginner', 'intermediate', 'advanced'].includes(value);
}

function isDisciplineSlug(value: string): value is DisciplineSlug {
  return ['yoga', 'pilates', 'reformer'].includes(value);
}

function mapDifficulty(value: string): Difficulty {
  if (!isDifficulty(value)) {
    throw new Error(`Unsupported difficulty value: ${value}`);
  }

  return value;
}

function mapDiscipline(row: DisciplineRow): Discipline {
  if (!isDisciplineSlug(row.slug)) {
    throw new Error(`Unsupported discipline slug: ${row.slug}`);
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

function mapExerciseCategory(row: ExerciseCategoryRow): ExerciseCategory {
  return {
    id: row.id,
    disciplineId: row.discipline_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    disciplineId: row.discipline_id,
    categoryId: row.category_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    instructions: row.instructions,
    difficulty: mapDifficulty(row.difficulty),
    durationSeconds: row.duration_seconds,
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    isActive: row.is_active,
  };
}

function mapProgram(row: ProgramRow): Program {
  return {
    id: row.id,
    disciplineId: row.discipline_id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    difficulty: mapDifficulty(row.difficulty),
    durationMinutes: row.duration_minutes,
    coverImageUrl: row.cover_image_url,
    isActive: row.is_active,
  };
}

function getJoinedExercise(
  value: ExerciseRow | ExerciseRow[],
): ExerciseRow {
  const exercise = Array.isArray(value) ? value[0] : value;

  if (!exercise) {
    throw new Error('Program exercise is missing its exercise relation.');
  }

  return exercise;
}

export async function getDisciplines(): Promise<Discipline[]> {
  const { data, error } = await supabase
    .from('disciplines')
    .select('id, name, slug, description, is_active, sort_order')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    throw error;
  }

  return (data as DisciplineRow[]).map(mapDiscipline);
}

export async function getExerciseCategories(
  disciplineId: string,
): Promise<ExerciseCategory[]> {
  const { data, error } = await supabase
    .from('exercise_categories')
    .select(
      'id, discipline_id, name, slug, description, sort_order, is_active',
    )
    .eq('discipline_id', disciplineId)
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    throw error;
  }

  return (data as ExerciseCategoryRow[]).map(mapExerciseCategory);
}

export async function getExercises(
  disciplineId: string,
): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select(
      'id, discipline_id, category_id, name, slug, description, instructions, difficulty, duration_seconds, image_url, video_url, is_active',
    )
    .eq('discipline_id', disciplineId)
    .eq('is_active', true)
    .order('name');

  if (error) {
    throw error;
  }

  return (data as ExerciseRow[]).map(mapExercise);
}

export async function getPrograms(
  disciplineId?: string,
): Promise<Program[]> {
  let query = supabase
    .from('programs')
    .select(
      'id, discipline_id, title, slug, description, difficulty, duration_minutes, cover_image_url, is_active',
    )
    .eq('is_active', true)
    .order('title');

  if (disciplineId) {
    query = query.eq('discipline_id', disciplineId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data as ProgramRow[]).map(mapProgram);
}

export async function getProgramBySlug(
  slug: string,
): Promise<ProgramWithExercises | null> {
  const { data: programData, error: programError } = await supabase
    .from('programs')
    .select(
      'id, discipline_id, title, slug, description, difficulty, duration_minutes, cover_image_url, is_active',
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (programError) {
    throw programError;
  }

  if (!programData) {
    return null;
  }

  const program = mapProgram(programData as ProgramRow);

  const { data: exerciseData, error: exerciseError } = await supabase
    .from('program_exercises')
    .select(
      `
        id,
        program_id,
        exercise_id,
        sort_order,
        duration_seconds,
        repetitions,
        rest_seconds,
        exercise:exercises (
          id,
          discipline_id,
          category_id,
          name,
          slug,
          description,
          instructions,
          difficulty,
          duration_seconds,
          image_url,
          video_url,
          is_active
        )
      `,
    )
    .eq('program_id', program.id)
    .order('sort_order');

  if (exerciseError) {
    throw exerciseError;
  }

  const exercises: ProgramExerciseWithExercise[] = (
    exerciseData as unknown as ProgramExerciseRow[]
  ).map((row) => ({
    id: row.id,
    programId: row.program_id,
    exerciseId: row.exercise_id,
    sortOrder: row.sort_order,
    durationSeconds: row.duration_seconds,
    repetitions: row.repetitions,
    restSeconds: row.rest_seconds,
    exercise: mapExercise(getJoinedExercise(row.exercise)),
  }));

  return {
    ...program,
    exercises,
  };
}