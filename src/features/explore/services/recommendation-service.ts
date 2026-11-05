
import type {
  Discipline,
  Exercise,
  ExerciseCategory,
} from '@/features/content/types/content';

import type {
  UserGoal,
  UserPreferences,
} from '@/features/onboarding/types/onboarding';

export const GOAL_CATEGORY_MAP: Record<UserGoal, string[]> = {
  flexibility: ['flexibility', 'mobility'],
  strength: ['core', 'upper-body', 'lower-body', 'full-body'],
  stress_relief: ['relaxation'],
  posture: ['balance', 'mobility', 'core'],
  general_fitness: [
    'flexibility',
    'mobility',
    'balance',
    'core',
    'full-body',
    'upper-body',
    'lower-body',
    'relaxation',
  ],
};

const DIFFICULTY_ORDER = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
} as const;

export type RecommendedExercise = {
  exercise: Exercise;
  discipline: Discipline;
  category: ExerciseCategory | null;
  score: number;
  matchedGoal: boolean;
  recommendationReason: string;
};

type RecommendationInput = {
  preferences: UserPreferences;
  exercises: Exercise[];
  disciplines: Discipline[];
  categories: ExerciseCategory[];
  limit?: number;
};

export function getRecommendedExercises({
  preferences,
  exercises,
  disciplines,
  categories,
  limit = 3,
}: RecommendationInput): RecommendedExercise[] {
  const selectedDisciplines = new Set(
    preferences.preferredDisciplines,
  );

  const disciplineById = new Map(
    disciplines.map((discipline) => [
      discipline.id,
      discipline,
    ]),
  );

  const categoryById = new Map(
    categories.map((category) => [
      category.id,
      category,
    ]),
  );

  const targetCategories =
    GOAL_CATEGORY_MAP[preferences.goal];

  const userDifficulty =
    DIFFICULTY_ORDER[preferences.experienceLevel];

  const recommendations = exercises
    .filter((exercise) => {
      if (!exercise.isActive) {
        return false;
      }

      const discipline = disciplineById.get(
        exercise.disciplineId,
      );

      if (
        !discipline ||
        !discipline.isActive ||
        !selectedDisciplines.has(discipline.slug)
      ) {
        return false;
      }

      return (
        DIFFICULTY_ORDER[exercise.difficulty] <=
        userDifficulty
      );
    })
    .map((exercise): RecommendedExercise => {
      const discipline = disciplineById.get(
        exercise.disciplineId,
      )!;

      const category = exercise.categoryId
        ? categoryById.get(exercise.categoryId) ?? null
        : null;

      const matchedGoal =
        category !== null &&
        category.isActive &&
        targetCategories.includes(category.slug);

      const score =
        (matchedGoal ? 100 : 0) +
        (exercise.difficulty ===
        preferences.experienceLevel
          ? 20
          : 10);

      const recommendationReason = matchedGoal
        ? 'Hedefinle uyumlu'
        : 'Seviyene uygun';

      return {
        exercise,
        discipline,
        category,
        score,
        matchedGoal,
        recommendationReason,
      };
    });

  return recommendations
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.exercise.id.localeCompare(b.exercise.id);
    })
    .slice(0, Math.max(0, limit));
}
