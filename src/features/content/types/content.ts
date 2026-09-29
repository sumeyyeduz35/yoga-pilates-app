export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type DisciplineSlug = 'yoga' | 'pilates' | 'reformer';

export interface Discipline {
  id: string;
  name: string;
  slug: DisciplineSlug;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ExerciseCategory {
  id: string;
  disciplineId: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Exercise {
  id: string;
  disciplineId: string;
  categoryId: string | null;

  name: string;
  slug: string;

  description: string | null;
  instructions: string | null;

  difficulty: Difficulty;
  durationSeconds: number | null;

  imageUrl: string | null;
  videoUrl: string | null;

  isActive: boolean;
}

export interface Program {
  id: string;
  disciplineId: string;

  title: string;
  slug: string;
  description: string | null;

  difficulty: Difficulty;
  durationMinutes: number | null;

  coverImageUrl: string | null;

  isActive: boolean;
}

export interface ProgramExercise {
  id: string;
  programId: string;
  exerciseId: string;

  sortOrder: number;

  durationSeconds: number | null;
  repetitions: number | null;
  restSeconds: number | null;
}

export interface ProgramExerciseWithExercise extends ProgramExercise {
  exercise: Exercise;
}

export interface ProgramWithExercises extends Program {
  exercises: ProgramExerciseWithExercise[];
}
